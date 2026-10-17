import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");      // lossless frames into the encoder
Config.setOverwriteOutput(true);
Config.setConcurrency(6);               // 16 logical cores; leave headroom for the browser
Config.setChromiumOpenGlRenderer("angle");
