import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import Audience from "./Audience";


@Table({
    underscored: true
})
export default class Game extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    id: string

    @ForeignKey(() => Audience)
    @AllowNull(false)
    @Column(DataType.UUID)
    audienceId: string // -> audience_id

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string

    @AllowNull(false)
    @Column(DataType.TEXT)
    description: string

    @AllowNull(false)
    @Column(DataType.INTEGER)
    price: string

    @BelongsTo(() => Audience)
    audience: Audience
}
