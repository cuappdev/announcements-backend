import {
  getModelForClass,
  prop,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Announcement {
  @prop()
  public apps!: string[];

  @prop()
  public body!: string;

  @prop()
  public endDate!: Date;

  @prop()
  public imageUrl!: string;

  @prop()
  public link!: string;

  @prop()
  public startDate!: Date;

  @prop()
  public title!: string;
}

export const AnnouncementModel = getModelForClass(Announcement);
