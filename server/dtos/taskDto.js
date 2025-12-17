module.exports = class taskDto {
  name;
  status;
  groupId;
  constructor(model) {
    this.name = model.name || undefined;
    this.status = model.status || 0;
    this.groupId = model.groupId || undefined;
  }
};
