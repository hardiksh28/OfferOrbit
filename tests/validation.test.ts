import test from 'node:test';
import assert from 'node:assert/strict';
import {validateResume,validateWorkspace,localDate} from '../lib/validation.ts';
test('rejects executable, empty and oversized resume uploads',()=>{assert.throws(()=>validateResume({name:'resume.exe',size:100}));assert.throws(()=>validateResume({name:'resume.pdf',size:0}));assert.throws(()=>validateResume({name:'resume.pdf',size:10485761}));});
test('accepts supported resume formats case-insensitively',()=>{for(const ext of ['PDF','DOCX','TXT'])assert.equal(validateResume({name:'resume.'+ext,size:100}),ext.toLowerCase());});
test('uses calendar dates with zero padded month and day',()=>{assert.equal(localDate(new Date(2026,0,3,23,45)),'2026-01-03');});
test('validates workspace collections and profile',()=>{const valid={opportunities:[],contacts:[],drafts:[],profile:{}};assert.deepEqual(validateWorkspace(valid),valid);for(const value of [null,{}, {...valid,drafts:null}, {...valid,profile:null}])assert.throws(()=>validateWorkspace(value));});
test('rejects oversized workspace data',()=>assert.throws(()=>validateWorkspace({opportunities:[],contacts:[],drafts:[],profile:{notes:'a'.repeat(1500000)}})));
