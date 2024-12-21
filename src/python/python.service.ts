import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class PythonService {
  runPythonScript(scriptPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
        if (error) {
          reject(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          reject(`stderr: ${stderr}`);
          return;
        }
        resolve(stdout);
      });
    });
  }
}
