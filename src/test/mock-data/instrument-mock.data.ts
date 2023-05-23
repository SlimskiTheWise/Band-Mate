import { Condition } from 'src/instuments/enums/condition.enum';
import { Type } from 'src/instuments/enums/type.enum';
import { Instruments } from 'src/instuments/instruments.entity';

export function seedSingleInstrument(): Instruments {
  const instrument = new Instruments();
  instrument.id = 1;
  instrument.condition = Condition.GOOD;
  instrument.location = 'seoul';
  instrument.price = 10000;
  instrument.title = 'gibson guitar';
  instrument.description = 'gibson guitar in good condition';
  instrument.type = Type.GUITAR;
  instrument.createdAt = new Date();
  instrument.updatedAt = new Date();
  instrument.deletedAt = null;
  return instrument;
}
