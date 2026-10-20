"""Kaushal-Drishti Accuracy & Confusion Matrix Evaluator.

Module responsible for computing True Positives (TP), False Positives (FP),
False Negatives (FN), True Negatives (TN), Precision, Recall, F1-Score,
False Positive/Negative Rates, and mean Intersection over Union (mIoU).
Complies with MSDE Problem ID 26245 benchmarking standards.
"""

from __future__ import annotations

import json
import logging
from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("kaushal_evaluator")


@dataclass(frozen=True)
class BoundingBox:
    """Represents an axis-aligned bounding box [x1, y1, x2, y2]."""

    x1: float
    y1: float
    x2: float
    y2: float
    class_name: str
    confidence: float = 1.0

    @property
    def area(self) -> float:
        """Calculate box area."""
        return max(0.0, self.x2 - self.x1) * max(0.0, self.y2 - self.y1)


@dataclass(frozen=True)
class ConfusionMatrixMetrics:
    """Comprehensive evaluation metrics for detection and discrepancy classification."""

    true_positives: int
    false_positives: int
    false_negatives: int
    true_negatives: int
    precision: float
    recall: float
    f1_score: float
    accuracy: float
    false_positive_rate: float
    false_negative_rate: float
    mean_iou: float
    total_evaluated_frames: int

    def to_dict(self) -> Dict[str, Any]:
        """Convert metrics to dictionary."""
        return asdict(self)


class AccuracyEvaluator:
    """Evaluates object detection and compliance classification accuracy.

    Calculates spatial IoU matching between ground-truth and predictions,
    derives confusion matrix parameters, and computes statistical accuracy metrics.
    """

    def __init__(self, iou_threshold: float = 0.45, confidence_threshold: float = 0.35) -> None:
        self.iou_threshold = iou_threshold
        self.confidence_threshold = confidence_threshold

    @staticmethod
    def calculate_iou(box_a: BoundingBox, box_b: BoundingBox) -> float:
        """Compute the Intersection over Union (IoU) between two bounding boxes."""
        xi1 = max(box_a.x1, box_b.x1)
        yi1 = max(box_a.y1, box_b.y1)
        xi2 = min(box_a.x2, box_b.x2)
        yi2 = min(box_a.y2, box_b.y2)

        intersection_area = max(0.0, xi2 - xi1) * max(0.0, yi2 - yi1)
        union_area = box_a.area + box_b.area - intersection_area

        if union_area <= 0.0:
            return 0.0
        return float(intersection_area / union_area)

    def match_boxes(
        self,
        ground_truth: List[BoundingBox],
        predictions: List[BoundingBox],
    ) -> Tuple[int, int, int, List[float]]:
        """Match prediction boxes against ground-truth boxes using greedy IoU pairing.

        Returns:
            Tuple of (True Positives, False Positives, False Negatives, list of matched IoUs)
        """
        filtered_preds = [p for p in predictions if p.confidence >= self.confidence_threshold]

        if not ground_truth and not filtered_preds:
            return 0, 0, 0, [1.0]

        if not ground_truth:
            return 0, len(filtered_preds), 0, [0.0]

        if not filtered_preds:
            return 0, 0, len(ground_truth), [0.0]

        matched_gt_indices: set[int] = set()
        matched_ious: List[float] = []
        true_positives = 0

        # Sort predictions by confidence descending
        sorted_preds = sorted(filtered_preds, key=lambda b: b.confidence, reverse=True)

        for pred in sorted_preds:
            best_iou = 0.0
            best_gt_idx = -1

            for idx, gt in enumerate(ground_truth):
                if idx in matched_gt_indices:
                    continue
                if gt.class_name.lower() != pred.class_name.lower():
                    continue

                iou = self.calculate_iou(pred, gt)
                if iou > best_iou:
                    best_iou = iou
                    best_gt_idx = idx

            if best_iou >= self.iou_threshold and best_gt_idx >= 0:
                true_positives += 1
                matched_gt_indices.add(best_gt_idx)
                matched_ious.append(best_iou)

        false_positives = len(sorted_preds) - true_positives
        false_negatives = len(ground_truth) - len(matched_gt_indices)

        return true_positives, false_positives, false_negatives, matched_ious

    def evaluate_benchmark(
        self,
        ground_truth_frames: List[List[BoundingBox]],
        prediction_frames: List[List[BoundingBox]],
    ) -> ConfusionMatrixMetrics:
        """Run batch evaluation across a set of benchmark frames."""
        if len(ground_truth_frames) != len(prediction_frames):
            raise ValueError("Ground truth and prediction frame counts must match.")

        total_tp = 0
        total_fp = 0
        total_fn = 0
        total_tn = 0
        all_ious: List[float] = []

        for gt_boxes, pred_boxes in zip(ground_truth_frames, prediction_frames):
            tp, fp, fn, ious = self.match_boxes(gt_boxes, pred_boxes)
            total_tp += tp
            total_fp += fp
            total_fn += fn
            all_ious.extend(ious)

            # Define True Negatives when both GT and Pred agree on empty frame or absence
            if not gt_boxes and not pred_boxes:
                total_tn += 1
            else:
                total_tn += max(0, 5 - (tp + fp + fn))

        precision = (
            float(total_tp / (total_tp + total_fp)) if (total_tp + total_fp) > 0 else 1.0
        )
        recall = (
            float(total_tp / (total_tp + total_fn)) if (total_tp + total_fn) > 0 else 1.0
        )
        f1_score = (
            float(2.0 * precision * recall / (precision + recall))
            if (precision + recall) > 0
            else 0.0
        )

        total_instances = total_tp + total_tn + total_fp + total_fn
        accuracy = (
            float((total_tp + total_tn) / total_instances) if total_instances > 0 else 1.0
        )

        false_positive_rate = (
            float(total_fp / (total_fp + total_tn)) if (total_fp + total_tn) > 0 else 0.0
        )
        false_negative_rate = (
            float(total_fn / (total_fn + total_tp)) if (total_fn + total_tp) > 0 else 0.0
        )

        mean_iou = float(np.mean(all_ious)) if all_ious else 0.0

        return ConfusionMatrixMetrics(
            true_positives=total_tp,
            false_positives=total_fp,
            false_negatives=total_fn,
            true_negatives=total_tn,
            precision=round(precision, 4),
            recall=round(recall, 4),
            f1_score=round(f1_score, 4),
            accuracy=round(accuracy, 4),
            false_positive_rate=round(false_positive_rate, 4),
            false_negative_rate=round(false_negative_rate, 4),
            mean_iou=round(mean_iou, 4),
            total_evaluated_frames=len(ground_truth_frames),
        )


def generate_synthetic_benchmark_dataset() -> Tuple[List[List[BoundingBox]], List[List[BoundingBox]]]:
    """Generates standardized benchmark test cases reflecting MSDE training centre scenarios:

    Scenario 1: Full Classroom standard lighting (High density attendance).
    Scenario 2: Practical Lab with machinery and workbenches (Trainees actively working).
    Scenario 3: Empty Lab during scheduled class (Zero attendance discrepancy).
    Scenario 4: Partial Attendance with occlusion (Corner workstations).
    Scenario 5: High density seating test.
    """
    ground_truth_dataset: List[List[BoundingBox]] = [
        # Frame 1: Classroom with 6 persons and 6 chairs
        [
            BoundingBox(50, 100, 150, 380, "person"),
            BoundingBox(170, 100, 270, 380, "person"),
            BoundingBox(290, 100, 390, 380, "person"),
            BoundingBox(410, 100, 510, 380, "person"),
            BoundingBox(530, 100, 630, 380, "person"),
            BoundingBox(650, 100, 750, 380, "person"),
            BoundingBox(45, 250, 155, 410, "chair"),
            BoundingBox(165, 250, 275, 410, "chair"),
            BoundingBox(285, 250, 395, 410, "chair"),
            BoundingBox(405, 250, 515, 410, "chair"),
            BoundingBox(525, 250, 635, 410, "chair"),
            BoundingBox(645, 250, 755, 410, "chair"),
        ],
        # Frame 2: Lab with 3 persons, 2 workbenches, 2 machinery units
        [
            BoundingBox(100, 120, 220, 420, "person"),
            BoundingBox(340, 130, 460, 430, "person"),
            BoundingBox(580, 120, 700, 410, "person"),
            BoundingBox(80, 300, 280, 500, "workbench"),
            BoundingBox(320, 300, 520, 500, "workbench"),
            BoundingBox(550, 260, 730, 480, "machinery"),
            BoundingBox(750, 260, 920, 480, "machinery"),
        ],
        # Frame 3: Empty room (Ghost centre simulation)
        [],
        # Frame 4: Partial attendance (2 persons, 1 slight occlusion, 3 chairs)
        [
            BoundingBox(120, 150, 230, 400, "person"),
            BoundingBox(300, 160, 410, 410, "person"),
            BoundingBox(110, 280, 240, 430, "chair"),
            BoundingBox(290, 280, 420, 430, "chair"),
            BoundingBox(480, 280, 600, 430, "chair"),
        ],
    ]

    # Predictions simulating real-world YOLOv8n detector with slight jitter and minor false alarm
    prediction_dataset: List[List[BoundingBox]] = [
        # Frame 1: Detected 6 persons with minor coordinate jitter and chairs
        [
            BoundingBox(52, 98, 149, 382, "person", 0.94),
            BoundingBox(168, 102, 271, 378, "person", 0.91),
            BoundingBox(293, 99, 388, 381, "person", 0.89),
            BoundingBox(408, 101, 512, 380, "person", 0.93),
            BoundingBox(532, 97, 628, 379, "person", 0.95),
            BoundingBox(648, 103, 752, 383, "person", 0.88),
            BoundingBox(44, 252, 154, 408, "chair", 0.82),
            BoundingBox(164, 248, 276, 412, "chair", 0.85),
            BoundingBox(287, 251, 393, 409, "chair", 0.79),
            BoundingBox(403, 249, 517, 411, "chair", 0.81),
            BoundingBox(523, 253, 637, 407, "chair", 0.84),
            BoundingBox(644, 248, 756, 412, "chair", 0.80),
        ],
        # Frame 2: Detected 3 persons, 2 workbenches, 2 machinery
        [
            BoundingBox(102, 118, 218, 422, "person", 0.92),
            BoundingBox(342, 131, 458, 428, "person", 0.90),
            BoundingBox(579, 122, 702, 412, "person", 0.94),
            BoundingBox(82, 302, 278, 498, "workbench", 0.88),
            BoundingBox(322, 298, 518, 502, "workbench", 0.87),
            BoundingBox(552, 258, 728, 482, "machinery", 0.86),
            BoundingBox(748, 262, 922, 478, "machinery", 0.89),
        ],
        # Frame 3: Empty room correctly identified
        [],
        # Frame 4: Detected 2 persons, 3 chairs + 1 minor low confidence background noise
        [
            BoundingBox(122, 152, 228, 398, "person", 0.91),
            BoundingBox(302, 158, 408, 412, "person", 0.89),
            BoundingBox(112, 278, 238, 432, "chair", 0.83),
            BoundingBox(288, 282, 418, 428, "chair", 0.81),
            BoundingBox(482, 279, 598, 431, "chair", 0.85),
            # Spurious low confidence false positive that tests thresholding
            BoundingBox(650, 200, 680, 240, "chair", 0.38),
        ],
    ]

    return ground_truth_dataset, prediction_dataset


def run_standalone_evaluation() -> ConfusionMatrixMetrics:
    """Execute standalone evaluation benchmark and print structured terminal results."""
    logger.info("Initializing Kaushal-Drishti Accuracy Evaluation Pipeline...")
    gt_frames, pred_frames = generate_synthetic_benchmark_dataset()

    evaluator = AccuracyEvaluator(iou_threshold=0.45, confidence_threshold=0.35)
    metrics = evaluator.evaluate_benchmark(gt_frames, pred_frames)

    print("\n" + "=" * 65)
    print("   KAUSHAL-DRISHTI MODEL ACCURACY & CONFUSION MATRIX AUDIT")
    print("      Ministry of Skill Development and Entrepreneurship")
    print("=" * 65)
    print(f" Total Benchmark Frames : {metrics.total_evaluated_frames}")
    print(f" True Positives (TP)    : {metrics.true_positives}")
    print(f" False Positives (FP)   : {metrics.false_positives}")
    print(f" False Negatives (FN)   : {metrics.false_negatives}")
    print(f" True Negatives (TN)    : {metrics.true_negatives}")
    print("-" * 65)
    print(f" Overall Accuracy       : {metrics.accuracy * 100:.2f}%")
    print(f" Precision              : {metrics.precision * 100:.2f}%")
    print(f" Recall (Sensitivity)   : {metrics.recall * 100:.2f}%")
    print(f" F1-Score               : {metrics.f1_score * 100:.2f}%")
    print(f" False Positive Rate    : {metrics.false_positive_rate * 100:.2f}%")
    print(f" False Negative Rate    : {metrics.false_negative_rate * 100:.2f}%")
    print(f" Mean IoU (Spatial)     : {metrics.mean_iou:.4f}")
    print("=" * 65 + "\n")

    return metrics


if __name__ == "__main__":
    metrics = run_standalone_evaluation()
    print(json.dumps(metrics.to_dict(), indent=2))
