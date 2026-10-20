"""Unit & Integration Tests for Kaushal-Drishti Edge Agent.

Validates:
- Privacy Gaussian blur kernel application
- Accuracy evaluator & confusion matrix calculations
- Operability score and IoU proximity logic
- WebP compression limits (<18 KB)
- FastAPI endpoints
"""

from __future__ import annotations

import numpy as np
import pytest
from fastapi.testclient import TestClient

from evaluator import AccuracyEvaluator, BoundingBox
from main import EdgeVideoAnalyticsEngine, app


@pytest.fixture
def test_client() -> TestClient:
    """Fixture providing FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def engine() -> EdgeVideoAnalyticsEngine:
    """Fixture providing isolated edge engine instance."""
    return EdgeVideoAnalyticsEngine(
        edge_node_id="TEST-NODE-001",
        centre_id="TC-TEST-001",
        centre_name="Test Skill Centre",
    )


def test_iou_calculation() -> None:
    """Validate Intersection over Union calculation."""
    box_a = BoundingBox(0, 0, 10, 10, "person")
    box_b = BoundingBox(0, 0, 10, 10, "person")
    # Identical boxes must have IoU = 1.0
    assert AccuracyEvaluator.calculate_iou(box_a, box_b) == pytest.approx(1.0)

    # Completely disjoint boxes must have IoU = 0.0
    box_c = BoundingBox(20, 20, 30, 30, "person")
    assert AccuracyEvaluator.calculate_iou(box_a, box_c) == pytest.approx(0.0)

    # 50% horizontal overlap (half area)
    box_d = BoundingBox(5, 0, 15, 10, "person")
    # Intersection = 5 * 10 = 50. Union = 100 + 100 - 50 = 150. IoU = 50/150 = 0.3333...
    assert AccuracyEvaluator.calculate_iou(box_a, box_d) == pytest.approx(50.0 / 150.0, rel=1e-3)


def test_evaluator_metrics_computation() -> None:
    """Validate precision, recall, and confusion matrix calculation."""
    evaluator = AccuracyEvaluator(iou_threshold=0.5, confidence_threshold=0.4)

    gt_boxes = [
        BoundingBox(10, 10, 50, 50, "person"),
        BoundingBox(60, 10, 100, 50, "person"),
    ]
    pred_boxes = [
        BoundingBox(12, 11, 49, 52, "person", 0.95),  # True Positive match
        BoundingBox(150, 150, 180, 180, "person", 0.85),  # False Positive
    ]

    metrics = evaluator.evaluate_benchmark([gt_boxes], [pred_boxes])

    assert metrics.true_positives == 1
    assert metrics.false_positives == 1
    assert metrics.false_negatives == 1
    assert metrics.precision == pytest.approx(0.5)
    assert metrics.recall == pytest.approx(0.5)
    assert metrics.f1_score == pytest.approx(0.5)


def test_privacy_gaussian_blur(engine: EdgeVideoAnalyticsEngine) -> None:
    """Validate that Gaussian blur is strictly applied to top 30% of bounding box."""
    test_frame = np.ones((400, 400, 3), dtype=np.uint8) * 128
    # Inject high frequency checker pattern in head area
    test_frame[20:80, 20:80] = 255

    person_boxes = [(20, 20, 80, 200)]  # height = 180, top 30% is 54px -> y: 20 to 74
    blurred_frame = engine.apply_privacy_gaussian_blur(test_frame, person_boxes, kernel_size=51)

    assert blurred_frame.shape == test_frame.shape
    # Ensure head area was modified (blurred)
    assert not np.array_equal(test_frame[20:70, 20:80], blurred_frame[20:70, 20:80])


def test_webp_proof_compression(engine: EdgeVideoAnalyticsEngine) -> None:
    """Validate WebP compression meets rural bandwidth requirements (<18 KB)."""
    raw_frame, _, _, _ = engine.generate_synthetic_stream_frame("NORMAL")
    webp_bytes, b64_str = engine.compress_webp_proof_frame(raw_frame, quality=35)

    assert len(webp_bytes) > 0
    # Must adhere to strict low-bandwidth rural quota (< 18 KB)
    assert len(webp_bytes) < 18 * 1024
    assert len(b64_str) > 0


def test_operability_scoring(engine: EdgeVideoAnalyticsEngine) -> None:
    """Validate person-to-equipment spatial IoU score calculation."""
    # Person directly at workbench
    person_boxes = [(100, 100, 150, 200)]
    equipment_boxes = [(90, 120, 180, 220)]

    operability = engine.calculate_operability_metrics(person_boxes, equipment_boxes)
    assert operability.operability_score > 0.0
    assert operability.active_trainees == 1


def test_health_endpoint(test_client: TestClient) -> None:
    """Validate health endpoint response."""
    resp = test_client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "HEALTHY"
    assert data["service"] == "kaushal-drishti-edge"


def test_telemetry_endpoint(test_client: TestClient) -> None:
    """Validate telemetry payload structure and fields."""
    resp = test_client.get("/api/v1/telemetry")
    assert resp.status_code == 200
    data = resp.json()
    assert "edge_node_id" in data
    assert "detected_headcount" in data
    assert "operability" in data
    assert "discrepancy_report" in data
    assert data["privacy_protocol"] == "GAUSSIAN_BLUR_K51_ZERO_BIOMETRIC"


def test_blurred_frame_endpoint(test_client: TestClient) -> None:
    """Validate blurred frame image endpoint returns valid image/webp."""
    resp = test_client.get("/api/v1/frame/blurred")
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "image/webp"
    assert len(resp.content) > 0


def test_database_stats_endpoint(test_client: TestClient) -> None:
    """Validate SQLite database metadata and tables count."""
    resp = test_client.get("/api/v1/database/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "HEALTHY"
    assert "tables" in data
    assert data["tables"]["centres"] >= 1
    assert data["tables"]["candidates"] >= 1


def test_database_biometric_punch_input(test_client: TestClient) -> None:
    """Validate real biometric AEBAS punch input into SQLite."""
    payload = {
        "candidate_id": "TR-0841",
        "batch_id": "BATCH-VNS-2026-01",
        "auth_mode": "FINGERPRINT_MINUTIAE",
        "terminal_device_id": "UIDAI-LIVE-TERM-01",
        "geofence_status": "VALID_PREMISES",
    }
    resp = test_client.post("/api/v1/database/punch", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SUCCESS"
    assert data["action"] == "AEBAS_BIOMETRIC_PUNCH_RECORDED"
    assert data["candidate_id"] == "TR-0841"


def test_database_sql_workbench_query(test_client: TestClient) -> None:
    """Validate executing read-only SQL queries in the live workbench."""
    resp = test_client.post(
        "/api/v1/database/query",
        json={"query": "SELECT candidate_id, full_name, assigned_station FROM candidates LIMIT 3;"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "SUCCESS"
    assert len(data["columns"]) == 3
    assert len(data["rows"]) == 3

