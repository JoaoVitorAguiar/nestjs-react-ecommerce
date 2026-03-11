import { Type } from "class-transformer"
import { IsArray, ValidateNested, IsInt, Min } from "class-validator"

export class SyncCartItemDto {

    @IsInt()
    @Min(1)
    productId: number

    @IsInt()
    @Min(1)
    quantity: number
}

export class SyncCartDto {

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SyncCartItemDto)
    items: SyncCartItemDto[]
}