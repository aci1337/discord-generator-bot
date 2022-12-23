const fs = require('fs'); 
const Discord = require("discord.js"); 
const token = 'YOUR TOKEN';
const client = new Discord.Client(); 


const accountData = fs.readFileSync('./accounts.txt', 'utf8'); 


let accounts = accountData.split('\n'); 


let channelID;


let userAccountCounts = {};


let userCooldowns = {};


let cooldownTime = 600000; // 10 minutes in milliseconds


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
client.user.setActivity('\u2B50️ made by ac \u2B50️ ', { type: 'PLAYING' });
});

client.on('message', message => { 
  if (message.channel.type === 'text') {
    if (message.content.startsWith('/')) { 
      if (message.content === '/setchannel') { 
        if (message.member.hasPermission('ADMINISTRATOR')) { 
          channelID = message.channel.id; 
          message.channel.send('This channel has been set as the account generator channel'); 
        } else { 
          message.channel.send('You must have administrator permissions to use this command!'); 
        } 
      } 
      // Check if the command is 'generate' 
      if (message.content === '/generate') { 
        // Check if the channel ID matches the current channel 
        if (message.channel.id === channelID) { 
          // Check if the user is on cooldown 
          if (userCooldowns[message.author.id] && userCooldowns[message.author.id] > Date.now()) { 
            // Get the remaining cooldown time 
            const timeLeft = (userCooldowns[message.author.id] - Date.now()) / 1000; 
            // Send a message to the user 
            message.channel.send(`You are still on cooldown for ${timeLeft.toFixed(0)} seconds!`); 
          } else { 
            // Generate a random account from the array 
            const account = accounts[Math.floor(Math.random() * accounts.length)]; 
            // Check if the account has already been generated 
            if (accounts.includes(account)) { 
              // Remove the account from the array 
              accounts.splice(accounts.indexOf(account), 1);
              // Send a messsage to the user so he knows his acc arrived.
              message.channel.send(`You're account has been sent, check your dm.`); 
              // Send the account details to the user in a DM 
              message.author.send(`Here is your account: 
              ${account}`); 
              // Set the user's cooldown 
              userCooldowns[message.author.id] = Date.now() + cooldownTime; 
              // Add the user to the userAccountCounts object 
              if (userAccountCounts[message.author.id]) {
                userAccountCounts[message.author.id] += 1;
              } else {
                userAccountCounts[message.author.id] = 1;
              } 
              // Remove the account from the .txt file 
              fs.writeFileSync('./accounts.txt', accounts.join('\n')); 
            } else { 
              // Check if the array is empty 
              if (accounts.length === 0) { 
                // Read the .txt file again and save the contents 
                const newAccountData = fs.readFileSync('./accounts.txt', 'utf8'); 
                // Split the contents of the .txt file into an array 
                accounts = newAccountData.split('\n'); 
                // Generate a random account from the array 
                const newAccount = accounts[Math.floor(Math.random() * accounts.length)]; 
                // Remove the account from the array 
                accounts.splice(accounts.indexOf(newAccount), 1); 
                // Send the account details to the user in a DM 
                message.author.send(`Here is your account: 
                ${newAccount}`); 
                // Set the user's cooldown 
                userCooldowns[message.author.id] = Date.now() + cooldownTime; 
                // Add the user to the userAccountCounts object 
                if (userAccountCounts[message.author.id]) {
                  userAccountCounts[message.author.id] += 1;
                } else {
                  userAccountCounts[message.author.id] = 1;
                }
                // Remove the account from the .txt file 
                fs.writeFileSync('./accounts.txt', accounts.join('\n')); 
                message.channel.send(`You have received your account! You are now on cooldown for ${cooldownTime / 60000} minutes.`);
              } else { 
                // Send a message to the user if no account is available 
                message.author.send('Sorry, all accounts have been taken.'); 
              } 
            } 
          }
        } 
      } 
       if (message.content === '/github') {
    message.reply('as you know the bot is open source :D, so here is the source: ');
  }
      // Check if the command is 'stock' 
      if (message.content === '/stock') { 
        // Check if the channel ID matches the current channel 
        if (message.channel.id === channelID && !message.author.bot) { 
          // Check if there are any accounts left 
          if (accounts.length > 0) { 
            // Send a message to the user with the amount of accounts left 
            message.channel.send(`There are ${accounts.length} accounts left!`); 
          } else { 
            // Read the .txt file again and save the contents 
            const newAccountData = fs.readFileSync('./accounts.txt', 'utf8'); 
            // Split the contents of the .txt file into an array 
            accounts = newAccountData.split('\n'); 
            // Send a message to the user with the amount of accounts left 
            message.channel.send(`There are ${accounts.length} accounts left!`); 
          } 
        } 
      } 
      if (message.content === '/deleteaccounts') { 
        // Make sure the user has administrator permissions 
        if (message.member.hasPermission('ADMINISTRATOR')) {
          // Clear the accounts array
          accounts = [];
          userAccountCounts = {};
          userCooldowns = {};
          // Clear the .txt file
          fs.writeFileSync('./accounts.txt', '');
          message.channel.send('All accounts have been deleted.');
        } else { 
          message.channel.send('You must have administrator permissions to use this command!'); 
        }
      }
      if (message.content === '/nuke') { 
        // Make sure the user has administrator permissions 
        if (message.member.hasPermission('ADMINISTRATOR')) {
          // Delete all messages in the channel 
          message.channel.bulkDelete(100);
          // Send a confirmation message 
          message.channel.send('All messages have been deleted.');
        } else { 
          // Send an error message 
          message.channel.send('You must have administrator permissions to use this command!'); 
        }
      }
      // Check if the command is 'removecooldown'
      if (message.content.startsWith('/removecooldown')) { 
        // Make sure the user has administrator permissions 
        if (message.member.hasPermission('ADMINISTRATOR')) {
          let args = message.content.split(' ');
          // Make sure the user provides a valid user ID 
          if (args.length === 2 && !isNaN(args[1])) { 
            // Remove the user's cooldown 
            delete userCooldowns[args[1]];
            // Send a confirmation message 
            message.channel.send(`The cooldown has been removed for the user with the ID ${args[1]}.`);
          } else { 
            // Send an error message 
            message.channel.send('You must provide a valid user ID!'); 
          }
        } else { 
          // Send an error message 
          message.channel.send('You must have administrator permissions to use this command!'); 
        }
      }
            // Check if the command is 'help' 
      if (message.content === '/help') { 
        // Create a help message 
        let helpMessage = '**List of commands:**\n\n';
        helpMessage += '*/setchannel* - Set the current channel as the account generator channel. *(Administrator only)*\n';
        helpMessage += '*/generate* - Generate a random account. *(Cooldown: 10 minutes)*\n';
        helpMessage += '*/stock* - Check how many accounts are left.\n';
        helpMessage += '*/setcooldown* *[minutes]* - Set the cooldown time for the /generate command. *(Administrator only)*\n';
        helpMessage += '*/nukeaccounts* - Delete all accounts. *(Administrator only)*\n';
        helpMessage += '*/nuke* - Delete all messages in the channel. *(Administrator only)*\n';
        helpMessage += '*/removecooldown* *[user ID]* - Remove the cooldown for a specific user. *(Administrator only)*\n';
helpMessage += '*/addaccounts*  - Add accounts to the generator. *(Administrator only)*\n';
        helpMessage += '*/github* - Display the GitHub source link.\n';
        helpMessage += '*/help* - Display this help message.\n';
        
        // Send the help message 
        message.channel.send(helpMessage);
      } 
      // Check if the command is 'setcooldown'
      if (message.content.startsWith('/setcooldown')) {
        // Make sure the user has administrator permissions 
        if (message.member.hasPermission('ADMINISTRATOR')) {
          let args = message.content.split(' ');
          // Make sure the user provides a valid number 
          if (args.length === 2 && !isNaN(args[1]) && args[1] >= 1 && args[1] <= 99) { 
            // Set the cooldown time 
            cooldownTime = args[1] * 60000;
            // Send a confirmation message 
            message.channel.send(`The cooldown has been set to ${args[1]} minutes.`);
          } else { 
            // Send an error message 
            message.channel.send('You must provide a valid number between 1 and 99!'); 
          }
        } else { 
          // Send an error message 
          message.channel.send('You must have administrator permissions to use this command!'); 
         // Check if the command is 'addaccounts'
      if (message.content.startsWith('/addaccounts')) {
        // Make sure the user has administrator permissions
        if (message.member.hasPermission('ADMINISTRATOR')) {
          // Split the message content into an array
          let accountsToAdd = message.content.split(' ');
          // Remove the command from the array
          accountsToAdd.shift();
          // Loop through the account array
          accountsToAdd.forEach(account => {
            // Check if the account is a valid email:pass account
            if (account.includes(':')) {
              // Add the account to the accounts array
              accounts.push(account);
              // Add the account to the .txt file
              fs.appendFileSync('./accounts.txt', '\n' + account);
            }
          });
          // Send a confirmation message
          message.channel.send('Accounts added successfully!');
        } else {
          // Send an error message
          message.channel.send('You must have administrator permissions to use this command!');
        }
      }
    }
  }
    }
  }
});
client.login(token);