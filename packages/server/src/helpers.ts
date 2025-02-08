import { exec } from 'node:child_process';

export const execCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

export const callWithRetry = async <T>(
  fn: (...args: unknown[]) => T | Promise<T>,
  retries = 3
) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000 * i);
      });
    }
  }

  throw new Error('Max retries reached');
};
