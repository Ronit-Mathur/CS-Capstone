import {Image} from "react-native"

export default function RoundImage(source, size){
    return(
        <Image style={{width: size, height: size, borderRadius:size/2, overflow:"hidden"}} source={source}></Image>
    )
}