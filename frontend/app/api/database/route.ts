import { NextRequest, NextResponse } from "next/server";

const EDGE_AGENT_URL = process.env.EDGE_AGENT_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") || "stats";

  try {
    let endpoint = `${EDGE_AGENT_URL}/api/v1/database/stats`;

    if (action === "candidates") {
      endpoint = `${EDGE_AGENT_URL}/api/v1/database/candidates`;
    } else if (action === "backup") {
      endpoint = `${EDGE_AGENT_URL}/api/v1/database/backup`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": "application/x-sqlite3",
            "Content-Disposition": 'attachment; filename="kaushal_drishti_real_db.db"',
          },
        });
      }
    }

    const res = await fetch(endpoint, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        status: 200,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    return NextResponse.json({ error: "Failed to fetch from database node" }, { status: 502 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal database proxy error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || "punch";

    let endpoint = `${EDGE_AGENT_URL}/api/v1/database/punch`;
    let payload = body;

    if (action === "enroll") {
      endpoint = `${EDGE_AGENT_URL}/api/v1/database/candidate`;
    } else if (action === "query") {
      endpoint = `${EDGE_AGENT_URL}/api/v1/database/query`;
      payload = { query: body.query };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: 200 });
    }

    const errData = await res.json().catch(() => ({}));
    return NextResponse.json(errData, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal database proxy error" }, { status: 500 });
  }
}
