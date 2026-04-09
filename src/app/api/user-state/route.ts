import { NextResponse } from "next/server";
import { resolveAuthenticatedUserState } from "@/lib/user-state";
import { logError } from "@/lib/monitoring";

export async function GET() {
  try {
    const resolvedState = await resolveAuthenticatedUserState();

    if (!resolvedState) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      state: resolvedState.state,
      redirectPath: resolvedState.redirectPath,
    });
  } catch (error) {
    logError("user_state.fetch_failed", error);
    return NextResponse.json(
      { error: "Não foi possível verificar seu status agora." },
      { status: 500 }
    );
  }
}
