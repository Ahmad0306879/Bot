let enabled = false;

module.exports = {
  isEnabled: () => enabled,
  enable: () => enabled = true,
  disable: () => enabled = false
};
