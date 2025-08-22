import React from 'react'
import { ClipLoader } from "react-spinners";

const Spinner = ({loading}) => {
    const override= {
  display: "block",
  margin: "0 auto",
  borderColor: "green",
};
  return (
     <ClipLoader
        loading={loading}
        cssOverride={override}
        size={450}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  )
}

export default Spinner
