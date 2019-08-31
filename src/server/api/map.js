function stripToInt(str) {
    if (!str) return 0;
    return parseInt(str.replace(/[^0-9]/g, ""))
}

function wattToFloat(str) {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9\.]/g, ""))
}

function mapGpu(gpu, index) {
    return {
        id: gpu._attributes.id,
        index : index,
        utilization: {
            gpu : stripToInt(gpu.utilization.gpu_util._text),
            memory: stripToInt(gpu.utilization.memory_util._text)
        },
        power: {
            draw: wattToFloat(gpu.power_readings.power_draw._text),
            limit: wattToFloat(gpu.power_readings.power_limit._text)
        },
        temperature: {
            gpu: stripToInt(gpu.temperature.gpu_temp._text),
        },
        fanSpeed: stripToInt(gpu.fan_speed._text),
        display: gpu.display_mode._text
    }
}

function toGpuStatus(nvidiaSmi) {
    if (!nvidiaSmi)
        return null;

    return {
        timestamp: nvidiaSmi.timestamp._text,
        gpu: nvidiaSmi.gpu.map(mapGpu)
    }
} 

module.exports = {
    toGpuStatus : toGpuStatus
};