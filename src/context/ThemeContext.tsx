import {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";

type Theme =
| "light"
| "dark"
| "system";

type ThemeContextType = {
theme: Theme;

setTheme: (
theme: Theme
) => void;
};

const ThemeContext =
createContext<
ThemeContextType | null
>(null);

export function ThemeProvider({
children,
}:{
children:ReactNode;
}){

const [theme,setTheme]=
useState<Theme>("system");

useEffect(()=>{

const saved =
localStorage.getItem(
"theme"
);

if(
saved==="light"||
saved==="dark"||
saved==="system"
){
setTheme(saved);
}

},[]);

useEffect(()=>{

const root =
document.documentElement;

root.classList.remove(
"dark"
);

let resolved =
theme;

if(
theme==="system"
){

resolved =
window.matchMedia(
"(prefers-color-scheme: dark)"
).matches
? "dark"
: "light";

}

if(
resolved==="dark"
){

root.classList.add(
"dark"
);

}

localStorage.setItem(
"theme",
theme
);

},[theme]);

return(

<ThemeContext.Provider
value={{
theme,
setTheme,
}}
>

{children}

</ThemeContext.Provider>

);

}

export function useTheme(){

const context =
useContext(
ThemeContext
);

if(
!context
){

throw new Error(
"useTheme inside ThemeProvider"
);

}

return context;

}