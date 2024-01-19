const fs = require("fs");   

module.exports = async (client) => {

const SlashsArray = []

  fs.readdir(`./src/commandsSlash`, (error, folder) => {
  folder.forEach(subfolder => {
fs.readdir(`./src/commandsSlash/${subfolder}/`, (error, files) => { 
  files.forEach(files => {
    console.log(files)
      
  if(!files?.endsWith('.js')) return;
  files = require(`../commandsSlash/${subfolder}/${files}`);
  if(!files?.name) return;
  client.slashCommands.set(files?.name, files);
  SlashsArray.push(files)
  });
    });
  });
});
  client.on("ready", async (client) => {
    await console.log('Loading SlashCommands...')
    try {
    await client.application.commands.set(SlashsArray).then(async() => {
      await console.log('SlashCommands Loaded with Success!')
    })
  }
  catch(e) {
    console.log(e)
    await console.log('SlashCommands ERROR')
  }
    });
};