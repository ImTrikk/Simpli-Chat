import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

export function stringToColor(string) {
 let hash = 0;
 let i;

 /* eslint-disable no-bitwise */
 for (i = 0; i < string.length; i += 1) {
  hash = string.charCodeAt(i) + ((hash << 5) - hash);
 }

 let color = "#";

 for (i = 0; i < 3; i += 1) {
  const value = (hash >> (i * 8)) & 0xff;
  color += `00${value.toString(16)}`.slice(-2);
 }
 /* eslint-enable no-bitwise */

 return color;
}

export function stringAvatar(name) {
 if (typeof name !== "string" || name.trim() === "") {
  return {
   sx: {
    bgcolor: "#000", // Default color or some other error handling
   },
   children: "?", // Default character or error handling
  };
 }

 const nameParts = name.split(" ");
 if (nameParts.length >= 2) {
  return {
   sx: {
    bgcolor: stringToColor(name),
   },
   children: `${nameParts[0][0]}${nameParts[1][0]}`,
  };
 } else {
  // Handle the case where there's no space in the name
  return {
   sx: {
    bgcolor: stringToColor(name),
   },
   children: `${name[0]}`, // Just use the first character of the name
  };
 }
}
