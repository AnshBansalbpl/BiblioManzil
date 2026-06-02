import {
Moon,
Sun,
} from "lucide-react";

import {
useTheme,
}
from "../context/ThemeContext";

export default function ThemeToggle(){

const {
theme,
setTheme,
}=useTheme();

return(

<button

onClick={()=>

setTheme(

theme==="dark"

? "light"

: "dark"

)

}

aria-label=
"Toggle Theme"

className="

text-neutral-600

hover:text-black

transition-colors

duration-200

"

>

{

theme==="dark"

?

<Sun
className="
w-5
h-5
"
/>

:

<Moon
className="
w-5
h-5
"
/>

}

</button>

);

}