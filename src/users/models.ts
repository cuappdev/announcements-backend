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
export class User {
  @prop({ unique: true })
  public email!: string;

  @prop()
  public imageUrl!: string;

  @prop({ default: false })
  public isAdmin!: boolean;

  @prop()
  public name!: string;
}

export const UserModel = getModelForClass(User);
