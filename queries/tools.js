const db = require("../db/dbConfig.js");
// const { findAccount } = require("./auth.js");

//function will get all tool from a single user given the email to find the userid and hence ensuring user authenticated before tools are brought up for CRUD actions
/**
 * gets all tools from a user
 * @returns {object} all tools via json format
 **/
const getAlltoolsFromUser = async () => await db.any("SELECT * FROM tools");


//function will get a single tool from a single user given the email to find the userid and hence ensuring user authenticated before the tool is brought up retrieval
/**
 * gets a single tool from a user based on email and tool identification
 * @param {number} tool_id - a specific tool's identification number
 * @returns {object} a single tool via json format
 **/

const getOnetool = async (tool_id) =>
  await db.one("SELECT * FROM tools WHERE tool_id=$1",[tool_id]);


//function will update a tool from a single user given the email to find the userid and hence ensuring user authenticated before tools are brought up for updating action
/**
 * gets a single tool from a user based on email and tool identification
 * @param {number} tool_id - a specific tool's identification number
 * @param {object} tools - the tool's data to be edited
 * @returns {object} a single tool via json format that has been edited
 */
const updateOnetool = async (tool_id,tools) => {
  const { name_tools, description, price, stock_quantity, item_condition} = tools;

  return await db.one(
    "UPDATE tools SET name_tools=$1, description=$2, price=$3, stock_quantity=$4, item_condition=$5 WHERE tool_id=$6 RETURNING *",
    [name_tools, description, price, stock_quantity, item_condition, tool_id]
  );
};

//function will get a tool from a single user given the email to find the userid and hence ensuring user authenticated before tools are brought up for deletion
/**
 * deletes a single tool from a user based on email and tool identification
 * @param {number} tool_id - a specific tool's identification number
 **/

const deletetool = async (tool_id) =>
  await db.one("DELETE FROM tools WHERE tool_id=$1 RETURNING *", tool_id);
  

/**
 * creates a single tool from a user based on email which will determine the userid and thus the user who is making the tool
 * @param {number} tool_id - a specific tool's identification number
 * @param {object} tools - the tool's data to be edited
 * @returns {object} a single tool via json format
 */
const createtools = async (tool) => {
  const newtool = await db.one(
    "INSERT INTO tools (name_tools, description, price, stock_quantity, item_condition, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      tool.name_tools,
      tool.description,
      tool.price,
      tool.stock_quantity,
      tool.item_condition,
      tool.user_id
    ]
  );

  return newtool;
};

// CREATE TABLE tool_instrument (
//     id SERIAL PRIMARY KEY,
//     name TEXT,
//     description TEXT,
//     price INT,
//     stock_quantity INT,
//     item_condition TEXT,
//     hobby_id INT NOT NULL REFERENCES hobby(hobby_id)
//   );


const addToolMedia = async file => {
  const fileUploaded = await db.one(
    'INSERT INTO tool_media (file_name, file_size, file_url, tool_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [file.file_name, file.file_size, file.file_url, file.tool_id]
  )
  if(!fileUploaded.error){
      return fileUploaded
  }else{
    return fileUploaded.error
  }
}



const addThumbnailTools =async(thumbnail, tool_id)=>{
  const updatePost = await db.one(
    "UPDATE tools SET thumbnail=$1 WHERE tool_id=$2 returning *", [thumbnail, tool_id]
  )
  if(!updatePost.error){
    return updatePost 
  }
  return updatePost.error
}

module.exports = {
  getAlltoolsFromUser,
  getOnetool,
  updateOnetool,
  deletetool,
  createtools,
  addToolMedia,
  addThumbnailTools,
};
