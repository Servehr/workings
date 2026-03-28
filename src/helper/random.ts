export const random = {

    character : function(length: number)
    {
        const characters ='ABCDEFGdxXqldoemQml1pmkldSmSJUBTHSNhnjkukdolffj387fy4jdi4okdHIJKLMNOPQRSTUVWXYZre4fkifjSElabcdefghijklmnopqrstuvwxyz0123456789';

        let result = ' ';
        const charactersLength = characters.length;

        for ( let i = 0; i < length; i++ ) 
        {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result    
    }

}