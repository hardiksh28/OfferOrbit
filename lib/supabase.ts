import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { validateResume, validateWorkspace } from './validation';
let client:SupabaseClient|null=null;
export const configured=Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export function supabase(){
 if(!configured)throw new Error('Connect Supabase to enable your private workspace.');
 if(!client)client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
 return client;
}
async function identity(){const {data,error}=await supabase().auth.getUser();if(error||!data.user)throw new Error('Please sign in to continue.');return data.user.id;}
export async function loadWorkspace(){const user_id=await identity();const {data,error}=await supabase().from('workspaces').select('data').eq('user_id',user_id).maybeSingle();if(error)throw error;return data?.data??null;}
export async function storeWorkspace(value:unknown){validateWorkspace(value);const user_id=await identity();const {error}=await supabase().from('workspaces').upsert({user_id,data:value,updated_at:new Date().toISOString()});if(error)throw error;}
export async function uploadResume(file:File){const ext=validateResume(file);const user=await identity();const path=`${user}/resume.${ext}`;const {error}=await supabase().storage.from('resumes').upload(path,file,{upsert:true,contentType:({'pdf':'application/pdf','docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','txt':'text/plain'} as Record<string,string>)[ext]});if(error)throw error;return path;}
export async function downloadResume(path:string,name:string){await identity();const {data,error}=await supabase().storage.from('resumes').download(path);if(error)throw error;const url=URL.createObjectURL(data);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
