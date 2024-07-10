import {
  getModelForClass,
  prop,
  modelOptions,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { Review } from "../reviews/models";

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
  @prop()
  public firstName!: string;

  /**
   * @ignore See https://github.com/lukeautry/tsoa/issues/626.
   */
  @prop({ ref: () => Review })
  public reviews?: Ref<Review>[];
}

export const UserModel = getModelForClass(User);
