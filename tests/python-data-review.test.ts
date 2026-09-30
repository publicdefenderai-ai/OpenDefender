import {spawnSync} from 'node:child_process';
import {expect,it} from 'vitest';

// The existing CI runs tests/. Keep Python extraction guards on that same path
// without requiring broader GitHub credentials to author a new workflow.
it('runs all Python statutory extraction and benchmark guard tests',()=>{
  const env=Object.fromEntries(Object.entries(process.env).filter(([key])=>!/(?:KEY|TOKEN|SECRET|PASSWORD|PASS|CREDENTIAL|DATABASE|PAT)$/i.test(key)));
  const result=spawnSync('python3',['-m','unittest','discover','-s','scripts/data-review/california-verification','-p','test_*.py'],{env,encoding:'utf8',timeout:60_000,maxBuffer:1024*1024});
  expect(result.error,'Python 3 is required for the source-verification tests').toBeUndefined();
  expect(result.status,(result.stdout+'\n'+result.stderr).slice(-20_000)).toBe(0);
},70_000);
