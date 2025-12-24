import type { CSSProperties } from "react";
import cl from "./MyLoader.module.css";
interface MyLoaderProps {
  visible?: boolean;
  style?: CSSProperties;
}
const MyLoader = ({ style = {}, visible = true }: MyLoaderProps) => {
  return (
    <div className={`${cl.loaderContainer} ${visible ? "" : cl.hidden}`}>
      <div style={style} className={cl.loader}></div>
    </div>
  );
};

export default MyLoader;
