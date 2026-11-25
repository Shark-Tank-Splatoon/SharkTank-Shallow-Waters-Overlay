module.exports = function (nodecg) {
    nodecg.extensions['ipl-overlay-controls']
        .bundleConfigDeclarationService
        .declareCustomScenes(nodecg.bundleName, [
            { name: 'Stream Start', value: 'start' }
        ]);
};