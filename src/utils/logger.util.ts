import { LogRequestDTO } from "../dtos/system.dto"; // Import the LogRequestDTO type from the DTOs
import colors from "colors"; // Import the colors library for colored console output

class Logger {
  constructor() {} // Empty constructor, not doing anything currently

/**
 *@name log
 *@description Logs out the data to the console
 *@param {LogRequestDTO} payload - see LogRequestDTO
 *@returns { void } - void
*/

  // Public method to log messages based on the provided payload
  public log(payload: LogRequestDTO):void{
    const { data, label, type } = payload; // Destructure data, label, and type from the payload

    if (data) { // Check if the data exists
      if (label) { // If a label is provided, log it
        console.log(label);
      }

      if (typeof(data) === "string") { // Check if the data is a string
        
        if (type) { // If a type is provided, determine the type of message

          if (type === "error") { // If type is "error", log the message in red and bold
            console.log(colors.red.bold(data)); 
          } else if (type === "success") { //  If type is "success", log the message in green and bold
            console.log(colors.green.bold(data)); 
          } else if (type === "warning"){
            console.log(colors.yellow.bold(data));
          } // If type is "warning", log the message in yellow and bold
            
        }
        else{
          console.log(data)
        }
      } else {
        console.log(data);
        // If the data is not a string, this block is currently empty
      }
    } else {
         // If no data is provided, log the data (which would be undefined or null)
      console.log(data);
    }
  }
}

export default new Logger(); //Export an instance of the Logger class as the default export
