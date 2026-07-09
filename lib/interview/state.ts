import { InterviewState, InterviewPhase } from "./types";


let currentInterview: InterviewState | null = null;


export function createInterview(question:string){

  currentInterview = {

    id: crypto.randomUUID(),

    question,

    phase: InterviewPhase.REQUIREMENTS,

    startedAt: Date.now(),

    phaseStartedAt: Date.now()

  };


  return currentInterview;
}



export function getInterview(){

  return currentInterview;

}