import { Request, Response } from "express";
import dotenv from "dotenv";
import { LiveSessionService } from "../services/liveService";
import { endLiveRoom } from "../live/hocuspocus";

dotenv.config();

/**
 * POST /live/page/:pageId
 */
export const createLiveSession = async (req: Request, res: Response) => {
  try {
    const { pageId: rawPageId } = req.params;
    const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;

    const userId = req.header("x-user-id");

    if (!userId) {
      return res.status(400).json({
        error: "Missing user id",
      });
    }

    const session = await LiveSessionService.createLiveSession(
      pageId,
      userId
    );

    res.status(201).json({
      sessionId: session.id,
      inviteToken: session.inviteToken,
      pageId: session.pageId,
      url: `${process.env.FRONTEND_URL}/invite/${session.inviteToken}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create live session",
    });
  }
};

/**
 * GET /live/invite/:inviteToken
 */
export const validateInvite = async (req: Request, res: Response) => {
  try {
    const { inviteToken: rawInviteToken } = req.params;
    const inviteToken = Array.isArray(rawInviteToken)
      ? rawInviteToken[0]
      : rawInviteToken;

    const session =
      await LiveSessionService.getLiveSessionByToken(inviteToken);

    res.json({
      sessionId: session.id,
      pageId: session.page.id,
      pageType: session.page.type,
      pageTitle: session.page.title,
      inviteToken: session.inviteToken,
      active: session.active,
    });
  } catch {
    res.status(404).json({
      error: "Invalid or expired invite.",
    });
  }
};

/**
 * POST /live/invite/:inviteToken/join
 */
export const joinLiveSession = async (req: Request, res: Response) => {
  try {
    const { inviteToken: rawInviteToken } = req.params;
    const inviteToken = Array.isArray(rawInviteToken)
      ? rawInviteToken[0]
      : rawInviteToken;

    const { name } = req.body;

    const session =
      await LiveSessionService.joinLiveSession(
        inviteToken,
        name
      );

    res.json({
      sessionId: session.id,
      pageId: session.page.id,
      pageType: session.page.type,
      pageTitle: session.page.title,
      inviteToken: session.inviteToken,
    });
  } catch {
    res.status(404).json({
      error: "Unable to join session.",
    });
  }
};

/**
 * GET /live/page/:pageId
 */
export const getLiveSessionStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { pageId: rawPageId } = req.params;
    const pageId = Array.isArray(rawPageId) ? rawPageId[0] : rawPageId;

    const session =
      await LiveSessionService.getLiveSessionActiveStatus(pageId);

    res.json(session);
  } catch {
    res.status(500).json({
      error: "Failed to fetch session.",
    });
  }
};

/**
 * PATCH /live/session/:sessionId/end
 */
export const endLiveSession = async (
  req: Request,
  res: Response
) => {
  try {
    const { sessionId: rawSessionId } = req.params;
    const sessionId = Array.isArray(rawSessionId)
      ? rawSessionId[0]
      : rawSessionId;

    const userId = req.header("x-user-id");

    if (!userId) {
      return res.status(400).json({
        error: "Missing user id",
      });
    }

    await endLiveRoom(sessionId, userId);

    res.json({
      success: true,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to end session";

    const status =
      message === "Only the page owner can end this live session"
        ? 403
        : message === "Live session not found or has ended"
        ? 404
        : 500;

    res.status(status).json({
      error: message,
    });
  }
};
