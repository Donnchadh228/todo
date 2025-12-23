import cl from "./MyLoader.module.css";
interface MyLoaderProps {
  visible?: boolean;
}
const MyLoader = ({ visible = true }: MyLoaderProps) => {
  return (
    <div className={`${cl.loaderContainer} ${visible ? "" : cl.hidden}`}>
      <div className={cl.loader}></div>
    </div>
  );
};

export default MyLoader;
