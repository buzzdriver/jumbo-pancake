import produce from "immer";
import { NamedSet } from "zustand/middleware";

import { AppState } from "../";
import { Announcement, announcements } from "./announcementBannerConfig";

const currentAnnouncements = announcements.filter((a) => {
  const now = new Date();

  return now > a.startDate && now < a.endDate;
});

interface FeedbackComponentsState {
  networkModalOpen: boolean;
  announcements: Announcement[];
}

interface FeedbackComponentsActions {
  showNetworkModal: (show: boolean) => void;
}

export interface FeedbackComponents {
  state: FeedbackComponentsState;
  actions: FeedbackComponentsActions;
}

const defaultState: FeedbackComponentsState = {
  networkModalOpen: false,
  announcements: currentAnnouncements,
};

export const feedbackComponentsSlice = (set: NamedSet<AppState>): FeedbackComponents => ({
  state: defaultState,
  actions: {
    showNetworkModal: (show) =>
      set(
        produce((draft: AppState) => {
          draft.feedbackComponents.state.networkModalOpen = show;
        }),
        false,
        "showNetworkModal",
      ),
  },
});
