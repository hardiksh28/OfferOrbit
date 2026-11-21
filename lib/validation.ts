export function validateResume(file: {name:string;size:number}) {
 if (!/\.(pdf|docx|txt)$/i.test(file.name)) throw new Error('Choose a PDF, DOCX or TXT file.');
 if (file.size===0) throw new Error('This file is empty.');
 if (file.size>10*1024*1024) throw new Error('Choose a file smaller than 10 MB.');
 return file.name.split('.').pop()!.toLowerCase();
}
export function localDate(date=new Date()) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function validateWorkspace(value:unknown){
 const v=value as Record<string,unknown>;
 if(!v || !Array.isArray(v.opportunities)||!Array.isArray(v.contacts)||!Array.isArray(v.drafts)||!v.profile||typeof v.profile!=='object')throw new Error('Invalid workspace data.');
 if(JSON.stringify(v).length>1500000)throw new Error('Workspace is too large. Export and archive old records.');
 return v;
}
