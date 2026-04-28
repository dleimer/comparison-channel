import React from "react";
import { Composition } from "remotion";
import { CruiseWars } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CruiseWars"
        component={CruiseWars}
        durationInFrames={1740}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
