import fs from 'fs';

module.exports.removeFiles   =   function(fileNames: [string], folder: string)
{
    fileNames.forEach(file => 
    {
        let pathToFileToRemove = `${folder}\\${file}`;
        if(fs.existsSync(pathToFileToRemove))
        {
            fs.unlinkSync(pathToFileToRemove);
        }
    });
    return;
}
