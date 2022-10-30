import React from "react";
import { Spinner } from "react-bootstrap";
import "./Loader.scss";

const Loader = () => {
  return (
    <div>
      <Spinner className="spinner" animation="border" />
    </div>
  )
}

export default Loader
