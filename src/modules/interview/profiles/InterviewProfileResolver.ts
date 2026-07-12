import { InterviewType } from "@prisma/client";

import { InterviewProfile } from "./InterviewProfile";
import { HLDInterviewProfile } from "./HLDInterviewProfile";
import { LLDInterviewProfile } from "./LLDInterviewProfile";

export class InterviewProfileResolver {
  resolve(
    type: InterviewType
  ): InterviewProfile {
    switch (type) {
      case InterviewType.HLD:
        return HLDInterviewProfile;

      case InterviewType.LLD:
        return LLDInterviewProfile;

      case InterviewType.DSA:
        return LLDInterviewProfile;

      default:
        throw new Error(
          `Unsupported interview type: ${type}`
        );
    }
  }
}