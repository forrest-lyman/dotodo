// index.ts
import inquirer from 'inquirer';

async function runCLI() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your name?',
      },
      {
        type: 'confirm',
        name: 'likeCLI',
        message: 'Do you like CLI programs?',
        default: true,
      },
    ]);

    console.log(`\nHello, ${answers.name}!`);
    console.log(
      answers.likeCLI
        ? "Great, it's awesome to have you here!"
        : "No worries, CLI programs aren't for everyone!"
    );
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

runCLI();
