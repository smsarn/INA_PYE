import React from "react";

import { MultiButtons } from "./MultiButtons";
import imageToBase64 from "image-to-base64/browser";

import {
  IMAGE_LOGO,
  OUTPUT_WIDTH_PCT,
  COVER_IMAGE,
} from "../definitions/generalDefinitions";
import { BorderRight } from "@material-ui/icons";

export class AdjustibleImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSize: this.props.ID === IMAGE_LOGO ? 100 : this.props.size,
      imageLeft: this.props.imageLeft,
      allPages: this.props.allPages,
      imageTop: this.props.top,
      showDetails: false,
      image: this.props.image,
      undoImage: this.props.undoImage,
      undo: false,
    };
    this.non64 = true;
  }

  convertimageToBase64 = (image) => {
    imageToBase64(image)
      .then((response) => {
        this.setState({ image: response, undoImage: response });
      })
      .catch((error) => {
        console.log(error); // Logs an error if there was one
      });
  };

  componentDidMount = () => {
    if (this.props.nonBase64) {
      this.convertimageToBase64(this.props.image);
    }
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
      default: false,
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
    {
      this.setState(
        (prevState) => ({
          imageLeft: parseFloat(
            prevState.imageLeft - Math.min(2, prevState.imageLeft)
          ),
        }),
        this.updateImage
      );
    }
  };

  imageRight = () => {
    const widthCont = document.getElementById(
      this.props.imagePackageID
    ).clientWidth;
    let inc = 2;
    if (
      this.state.allPages === false &&
      this.state.imageSize + ((this.state.imageLeft + 2) * widthCont) / 100 >
        widthCont - 25
    )
      inc =
        ((widthCont - this.state.imageSize - 25) * 100) / widthCont -
        this.state.imageLeft;
    else if (
      this.state.allPages &&
      this.state.imageSize / 2 -
        80 +
        ((this.state.imageLeft + 2) * widthCont) / 100 >
        widthCont
    )
      inc =
        ((widthCont - this.state.imageSize / 2 + 80) * 100) / widthCont -
        this.state.imageLeft;
    {
      this.setState(
        (prevState) => ({
          imageLeft: parseFloat(prevState.imageLeft + inc),
        }),
        this.updateImage
      );
    }
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
    document.getElementById(this.props.imagePackageID).style.display = "none";
  };

  showDetails = () => {
    const image = {
      image: this.state.image,
      left: this.state.imageLeft,
      size: this.props.ID === IMAGE_LOGO ? 100 : this.state.imageSize,
      allPages: this.state.allPages,
      imageTop: this.state.imageTop,
      showDetails: !this.state.showDetails,
    };
    this.props.imageAdjust(image, this.props.ID);
  };

  undoImage = () => {
    this.non64 = true;
    const image = {
      image: this.state.image,
      left: this.state.imageLeft,
      size: this.state.imageSize,
      allPages: this.state.allPages,
      imageTop: this.state.imageTop,
      showDetails: false,
    };

    if (this.props.undoImage !== undefined)
      this.setState({
        undo: true,
        image: image,
      });
  };

  imageDone = () => {
    this.setState(
      (prevState) => ({
        showDetails: false,
        imageSize: parseFloat(prevState.imageSize),
      }),
      this.updateImage
    );
    document.getElementById(this.props.imagePackageID).style.display = "none";
    this.props.updateImage(this.state.image, this.state.imageSize);
  };

  loadImage = (e) => {
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);
    this.non64 = false;
    var image = new Image();
    reader.onload = async () => {
      image.onload = () => {
        const widthImg = image.width;

        const imageObj = {
          image: reader.result,
          left: 0, //this.state.imageLeft,
          size: widthImg, //this.state.imageSize,
          allPages: false,
          imageTop: this.state.imageTop,
          showDetails: this.props.showDetails,
        };
        this.setState(
          () => ({
            image: reader.result,
            imageSize: widthImg,
            imageLeft: 0,
            showDetails: this.props.showDetails,
            allPages: this.props.allPages,
            undo: false,
          }),
          this.props.ID === IMAGE_LOGO
            ? this.props.imageAdjust(imageObj, this.props.ID)
            : this.imageDone
        );
      };

      image.src = reader.result;
    };
  };

  render() {
    const styleImage = {
      float: "left",
      /* width: this.props.ID===IMAGE_LOGO?this.state.imageSize + "%":OUTPUT_COVER_IMAGE_WIDTH_PCT +"%", */
      display: "table-cell",
      marginTop: "-.2em",
      marginBottom: ".8em",
      marginLeft: this.state.imageLeft + "%",
      clear: "both",
      width: this.props.ID === IMAGE_LOGO ? "max-content" : "auto",
      maxWidth: "800px",
      maxHeight: "400px",
    };
    //console.log(this.state.image)
    const lang = this.props.language !== undefined ? this.props.language : "en";
    const cmdWidth =
      this.props.buttonText !== undefined
        ? this.props.buttonText.length * (lang === "en" ? 10 : 14)
        : 0;

    // image from file reader has the complete base64 format, images converted do not

    const completeImg64Formaat =
      this.state.image === null || this.state.image === undefined
        ? false
        : this.state.image.toString().includes("data:image");

    const buttonID = "button" + this.props.imagePackageID;
    return (
      <div
        id={this.props.imagePackageID}
        style={{
          float: "left",
          marginTop: "12px",
          marginBottom: "12px",
          width: OUTPUT_WIDTH_PCT + "%",
          border: this.props.ID === IMAGE_LOGO ? "solid 2px lightgrey" : "",
          borderRight:
            this.props.ID === IMAGE_LOGO
              ? this.state.allPages
                ? "dashed 2px lightblue"
                : "solid 2px lightgrey"
              : "",
        }}
      >
        <div
          className="no-print"
          style={{ overflow: "hidden", paddingLeft: "2.5%" }}
        >
          {this.state.showDetails === false && cmdWidth > 0 && (
            <label className="roundedCornerCmd">
              <input
                id={buttonID}
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
          {this.props.undoImage !== undefined && (
            <input
              className="roundedCornerCmd"
              style={{ marginLeft: "10px" }}
              onClick={this.undoImage}
              type="button"
              value={lang === "en" ? "Undo" : "Annuler"}
            />
          )}
          {this.props.undoImage !== undefined && (
            <input
              className="roundedCornerCmd"
              style={{ marginLeft: "10px" }}
              onClick={this.imageDone}
              type="button"
              value={lang === "en" ? "done" : "terminé"}
            />
          )}
        </div>
        <br /> <br />
        {/*  <hr className="ppi1 no-print" /> */}
        {this.state.showDetails && (
          <>
            <div className="no-print" style={{ marginLeft: "20px" }}>
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
                width={lang === "en" ? "80px" : "120px"}
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
        {/* don't show image adj controls if cover image */}
        <div style={styleImage}>
          {this.state.image === null ? (
            ""
          ) : (
            <img
              className="ppi1"
              id={this.props.ID}
              /*               src={this.state.undo?this.state.image.image: this.state.image} */
              src={
                this.state.undo
                  ? "data:image/png;base64, " + this.state.undoImage
                  : completeImg64Formaat
                  ? this.state.image
                  : "data:image/png;base64, " + this.state.image
              }
              /* src={this.non64===false && this.props.nonBase64===undefined ? this.state.image:(this.state.undo?"data:image/png;base64, "+this.state.undoImage: "data:image/png;base64, "+this.state.image)} */

              width={
                this.props.ID === IMAGE_LOGO
                  ? this.state.imageSize
                  : OUTPUT_WIDTH_PCT + "%"
              }
            />
          )}
        </div>
        <br />
        <br />
      </div>
    );
  }
}
