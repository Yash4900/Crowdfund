import image from '../images/spinner.jpg';

function Loading(props) {
  return (
    <div>
      <div style={{ marginTop: "10%", width: "100%", display: "flex", justifyContent: "center" }}>
        <img src={image} width="20%" />
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", fontSize: "20px" }}>
        <p>Please wait a moment</p>
      </div>
    </div>
  );
}

export default Loading;