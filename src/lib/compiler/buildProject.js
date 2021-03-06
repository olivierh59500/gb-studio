import fs from "fs-extra";
import compile, { EVENT_DATA_COMPILE_PROGRESS } from "./compileData";
import ejectBuild from "./ejectBuild";
import makeBuild from "./makeBuild";
import compileMusic from "./compileMusic";
import { emulatorRoot } from "../../consts";
import copy from "../helpers/fsCopy";

const buildProject = async (
  data,
  {
    buildType = "rom",
    projectRoot = "/tmp",
    tmpPath = "/tmp",
    outputRoot = "/tmp/testing",
    progress = () => {},
    warnings = () => {}
  } = {}
) => {
  const compiledData = await compile(data, {
    projectRoot,
    tmpPath,
    progress,
    warnings
  });
  await ejectBuild({
    outputRoot,
    compiledData,
    progress,
    warnings
  });
  await compileMusic({
    music: compiledData.music,
    projectRoot,
    buildRoot: outputRoot,
    progress,
    warnings
  });
  await makeBuild({
    buildRoot: outputRoot,
    buildType,
    progress,
    warnings
  });
  if (buildType === "web") {
    await copy(emulatorRoot, `${outputRoot}/build/web`);
    await copy(
      `${outputRoot}/build/rom/game.gb`,
      `${outputRoot}/build/web/rom/game.gb`
    );
  }
};

export default buildProject;
