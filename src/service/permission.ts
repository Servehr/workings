import async  from 'async';
const Roles         =   require("../model/role.js");
const User          =   require("../model/user.js");
const Privileges    =   require("../model/privilege.js");
const responze      =   require("../helper/response.js");
 
const permission = {
    
    countPrivilege : async () =>
    {
        try
        {            
            return await Privileges.countPrivilege();
        }catch(ex)
        {
            return null;
        }
    },
    allPrivileges : async () => 
    {
        try
        {            
            return await Privileges.allPrivileges();
        }catch(ex)
        {
            return null;
        }
    },
    checkIfPrivilegeExist : async (data : string) => 
    {
        try
        {            
            return await Privileges.allPrivileges(data);
        }catch(ex)
        {
            return null;
        }
    },
    allRoles : async () => 
    {
        try
        {            
            return await Roles.allRoles();
        }catch(ex)
        {
            return null;
        }
    },
    countRoles : async () => 
    {
        try
        {            
            return await Roles.countRoles();
        }catch(ex)
        {
            return null;
        }
    },
    checkIfRoleExist : (data : string) => 
    {
        try
        {            
            return Roles.checkIfRoleExist(data);
        }catch(ex)
        {
            return null;
        }
    },
    doesRoleExist : async (data : string) => 
    {
        try
        {            
            return await Roles.doesRoleExist(data);
        }catch(ex)
        {
            return null;
        }
    },
    getPrivilegeName : async (data : string) => 
    {
        try
        {
            Privileges.
            findOne({ "_id" : data}, (err: any, privilege: any) =>
            {
                if(!err)
                {
                    console.log(privilege);
                    return privilege;
                }
            })
        }catch(ex)
        {
            return null;
        }
    }
    
}

module.exports.permission  =  permission;