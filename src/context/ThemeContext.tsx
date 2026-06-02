import {
createContext,
useContext,
useEffect,
useState,
ReactNode,
} from "react";

type Theme =
| "light"
| "dark";

type ThemeContextType = {
theme: Theme;
setTheme: (
theme: Theme
)=>void;
};

const ThemeContext =
createContext<
ThemeContextType
| null
>(null);

export function ThemeProvider({
children,
}:{
children:ReactNode;
}){

const [theme,setTheme]=
useState<Theme>(

localStorage.getItem(
"theme"
)==="dark"

? "dark"

: "light"

);

useEffect(()=>{

const root =
document.documentElement;

if(
theme==="dark"
){

root.classList.add(
"dark"
);

}else{

root.classList.remove(
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

const context=
useContext(
ThemeContext
);

if(
!context
){

throw new Error(
"useTheme must be inside provider"
);

}

return context;

}