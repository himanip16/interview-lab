export interface Message {

role:
"candidate" | "ai";

content:string;

timestamp:number;

phase:string;

}


let messages:Message[]=[];


export function saveMessage(message:Message){

 messages.push(message);

}


export function getMessages(){

 return messages;

}