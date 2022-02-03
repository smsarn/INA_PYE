import React from "react";
import { MultiButtons } from "./MultiButtons";

import { OUTPUT_WIDTH_PCT } from "../definitions/generalDefinitions";

export class AdjustibleImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSize: this.props.size,
      imageLeft: this.props.imageLeft,
      allPages: this.props.allPages,
      imageTop: this.props.top,
      showDetails: false,
      image: this.props.image,
      undo: false,
    };
  }

  componentDidMount = () => {
    this.setState({ showDetails: false });
  };

  updateImage = () => {
    const image = {
      image: this.state.image,
      left: this.state.imageLeft,
      size: this.state.imageSize,
      allPages: this.state.allPages,
      top: this.state.imageTop,
      showDetails: this.state.showDetails,
    };
    this.props.imageAdjust(image, this.props.ID);
  };

  imageBigger = () => {
    this.setState(
      (prevState) => ({
        imageSize: parseFloat(prevState.imageSize * 1.1),
      }),
      this.updateImage
    );
  };

  imageSmaller = () => {
    this.setState(
      (prevState) => ({
        imageSize: parseFloat(prevState.imageSize * 0.9),
      }),
      this.updateImage
    );
  };

  imageLeft = () => {
    this.setState(
      (prevState) => ({
        imageLeft: parseFloat(prevState.imageLeft - 2),
      }),
      this.updateImage
    );
  };

  imageRight = () => {
    this.setState(
      (prevState) => ({
        imageLeft: parseFloat(prevState.imageLeft + 2),
      }),
      this.updateImage
    );
  };

  imagePosition = (e) => {
    let top = e === 1 ? true : false;
    this.setState(
      { imageTop: top },

      this.updateImage
    );
  };

  imagePages = (e) => {
    let allPages = e === 1 ? false : true;
    this.setState(
      { allPages: allPages },

      this.updateImage
    );
  };

  imageRemove = () => {
    this.setState(
      {
        image: null,
        showDetails: false,
      },
      this.updateImage
    );
  };

  showDetails = () => {
    const image = {
      image: this.state.image,
      left: this.state.imageLeft,
      size: this.state.imageSize,
      allPages: this.state.allPages,
      imageTop: this.state.imageTop,
      showDetails: !this.state.showDetails,
    };
    this.props.imageAdjust(image, this.props.ID);
  };

  undoImage = () => {
    const image = {
      image: this.state.image,
      left: this.state.imageLeft,
      size: this.state.imageSize,
      allPages: this.state.allPages,
      imageTop: this.state.imageTop,
      showDetails: false,
    };
    
    if(this.props.undoImage!==undefined)
      image.image=this.props.undoImage
      this.setState(
      {
        image: image,
        undo: true
      },
    );

  };

  imageDone = () => {
    this.setState({
      showDetails: false,
    });
  };

  loadImage = (e) => {
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);

    let image;
    reader.onload = () => {
      image = reader.result;

      const imageObj = {
        image: image,
        left: this.state.imageLeft,
        size: this.state.imageSize,
        allPages: false,
        imageTop: this.state.imageTop,
        showDetails: this.props.showDetails,
      };
      this.setState(
        () => ({
          image: image,
          showDetails: this.props.showDetails,
          allPages: this.props.allPages,
          undo: false
        }),
        this.props.imageAdjust(imageObj, this.props.ID)
      );
    };
  };

  render() {
    const styleImage = {
      float: "left",
      width: OUTPUT_WIDTH_PCT + "%",
      display: "table-cell",
      marginTop: "-3px",
      marginBottom: "15px",
      marginLeft: this.state.imageLeft + "%",
    };
    //console.log(this.state.image)
    const lang = this.props.language !== undefined ? this.props.language : "en";
    const cmdWidth =
      this.props.buttonText !== undefined
        ? this.props.buttonText.length * (lang === "en" ? 10 : 14)
        : 0;

    return (
      <div
        id="image"
        style={{
          float: "left",
          marginTop: "12px",
          marginBottom: "12px",
          width: OUTPUT_WIDTH_PCT + "%",
        }}
      >
        <div style={{ paddingLeft: "2.5%" }}>
          {this.state.showDetails === false && cmdWidth > 0 && (
            <label className="roundedCornerCmd">
              <input
                type="file"
                required
                style={{ display: "none" }}
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .ico, .tiff, .svg,|image/*"
                onChange={this.loadImage}
                onClick={(event) => {
                  event.target.value = null;
                }}
              />
              <span style={{ marginTop: "10px", width: "40px" }}>
                {this.props.buttonText}
              </span>
              
            </label>
          )}
          {this.props.undoImage!==undefined && <input
             className="roundedCornerCmd"
              style={{marginLeft:"10px"}}
              onClick={this.undoImage}
              type="button"
              value={lang === "en" ? "Undo":"Annuler"}
            />}
        </div>
        <br /> <br />
        <hr className="ppi1" />
        {this.state.showDetails && (
          <>
            <div style={{ marginLeft: "20px" }}>
              <MultiButtons
                width={"80px"}
                noButtons={2}
                buttonCaption={[
                  lang === "en" ? "Top" : "Haut",
                  lang === "en" ? "Bottom" : "Bas",
                ]}
                selected={this.state.imageTop ? 1 : 2}
                selectMultiButton={this.imagePosition}
              />

              <MultiButtons
                width={"40px"}
                noButtons={1}
                buttonCaption={["+"]}
                selected={1}
                selectMultiButton={this.imageBigger}
              />
              <MultiButtons
                width={"40px"}
                noButtons={1}
                buttonCaption={["-"]}
                selected={1}
                selectMultiButton={this.imageSmaller}
              />

              <MultiButtons
                width={"50px"}
                noButtons={1}
                buttonCaption={[<text>&#8592;</text>]}
                selected={1}
                selectMultiButton={this.imageLeft}
              />
              <MultiButtons
                width={"50px"}
                noButtons={1}
                buttonCaption={[<text>&#8594;</text>]}
                selected={1}
                selectMultiButton={this.imageRight}
              />

              <MultiButtons
                width={lang === "en" ?"80px":"120px"}
                noButtons={2}
                buttonCaption={[
                  lang === "en" ? "1st page" : "1re page",
                  lang === "en" ? "All pages" : "toutes les pages",
                ]}
                selected={this.state.allPages ? 2 : 1}
                selectMultiButton={this.imagePages}
              />
              <MultiButtons
                width={"40px"}
                noButtons={1}
                buttonCaption={["x"]}
                selected={1}
                selectMultiButton={this.imageRemove}
              />
              <MultiButtons
                style={{ marginLeft: "20px" }}
                width={"80px"}
                noButtons={1}
                buttonCaption={[lang === "en" ? "done" : "terminé"]}
                selected={1}
                selectMultiButton={this.imageDone}
              />
            </div>
          </>
        )}
        <p />
        <div style={styleImage}>
          {this.state.image === null ? (
            ""
          ) : (
            <img
              className="ppi1"
              id={this.props.ID}
              src={this.state.undo?this.state.image.image: this.state.image}
              width={this.state.imageSize + "%"}
            />
          )}
        </div>
        <br />
        <br />
      </div>
    );
  }
}
