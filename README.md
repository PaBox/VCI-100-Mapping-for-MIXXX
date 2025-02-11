# VCI-100-Mapping-for-MIXXX
This repository should help anybody who still has a Vestax VCI-100 and wants to use MIXXX without sacrificing the capabilities off this controller.

 Missing (priorities top to bottom):
 1. Sync button should use colours if synced/not synced and be lockable
   - Support Sync lock with key2+sync?
 2. Finish effects
   - Focused effect gets master controls for volume
   - A and B should correspond to first effects settings
   - fx1 and fx2 should be automatically correctly mapped to decks 1 and 2 (master to none)
   - Add last effect button for changing selected effect on EffectUnit (example)
 3. Add LED indications to eject and play button for loaded preview-deck
   - show option on preview button
   - Should disable loop/hotcue mode altogether to be able to use the buttons
   - Ejecting should also disable the preview mode
 5. Add headphone effect pre-listen option
 6. Cleanup (use more builtin functions from mixxx)

# Developing
- The schem.drawio is showing what functions respond to which buttons
- the jsonconfig.json is responsible for correct linting etc.
- the controllers.vsworkspace is setting up the workspace in vscode (extensions will be added)

# Will always miss before firmware update
- Make use of multicolors
- Change LEDs of "set cue"(both), "load a/b", "up/down", "vinyl mode" buttons
  - not tested: "select", "effect"(top right), "cue >"(both)
