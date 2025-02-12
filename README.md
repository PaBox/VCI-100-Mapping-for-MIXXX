# VCI-100-Mapping-for-MIXXX
This repository should help anybody who still has a Vestax VCI-100 and wants to use MIXXX without sacrificing the capabilities of this controller.

 Missing (priorities top to bottom):
 1. Finish effects
   - Focused effect gets master controls for volume
   - A and B should correspond to first effects settings (in specific cases)
 2. Cleanup (use more builtin functions from mixxx, more consistent and reusable code)

# Developing
- The schem.drawio is showing the naming scheme for internal functions with their corresponding buttons
- the jsonconfig.json is responsible for correct linting etc.
- the controllers.vsworkspace is setting up the workspace in vscode (extensions will be added)

# Will always miss before firmware update
- Make use of multicolors
- Change LEDs of "set cue"(both), "load a/b", "up/down", "vinyl mode" buttons
  - not tested: "select", "effect"(top right), "cue >"(both)
