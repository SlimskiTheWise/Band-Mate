import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';
import { GoogleUser } from '../interfaces/google.user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    super({
      clientID: config.get<string>('oauth.googleClientId'),
      clientSecret: config.get<string>('oauth.googleClientSecret'),
      callbackURL: 'http://localhost:4000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    done: VerifiedCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user: GoogleUser = {
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      access_token,
      refresh_token,
    };
    done(null, user);
  }
}
