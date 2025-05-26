import React from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const IconAccount = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_1328_4"
          x1="9"
          y1="11"
          x2="9"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
        <LinearGradient
          id="paint1_linear_1328_4"
          x1="9"
          y1="1"
          x2="9"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
      <Path
        d="M1 15C1 13.9391 1.42143 12.9217 2.17157 12.1716C2.92172 11.4214 3.93913 11 5 11H13C14.0609 11 15.0783 11.4214 15.8284 12.1716C16.5786 12.9217 17 13.9391 17 15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15Z"
        stroke="url(#paint0_linear_1328_4)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
      <Path
        d="M1 15C1 13.9391 1.42143 12.9217 2.17157 12.1716C2.92172 11.4214 3.93913 11 5 11H13C14.0609 11 15.0783 11.4214 15.8284 12.1716C16.5786 12.9217 17 13.9391 17 15C17 15.5304 16.7893 16.0391 16.4142 16.4142C16.0391 16.7893 15.5304 17 15 17H3C2.46957 17 1.96086 16.7893 1.58579 16.4142C1.21071 16.0391 1 15.5304 1 15Z"
        stroke="url(#paint0_linear_1328_4)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
      <Path
        d="M9 7C10.6569 7 12 5.65685 12 4C12 2.34315 10.6569 1 9 1C7.34315 1 6 2.34315 6 4C6 5.65685 7.34315 7 9 7Z"
        stroke="url(#paint1_linear_1328_4)"
        strokeWidth="1.5"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
      <Path
        d="M9 7C10.6569 7 12 5.65685 12 4C12 2.34315 10.6569 1 9 1C7.34315 1 6 2.34315 6 4C6 5.65685 7.34315 7 9 7Z"
        stroke="url(#paint1_linear_1328_4)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        transform="matrix(1.333333,0,0,1.333333,0,0)"
      />
    </Svg>
  </View>
);

export const IconAdd = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.50006 4.56V14.44M4.56006 9.5H14.4401"
        stroke="url(#paint0_linear_1328_3)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="matrix(1.263158,0,0,1.263158,0,0)"
      />
      <Circle
        cx="9.5"
        cy="9.5"
        r="9"
        stroke="url(#paint0_linear_1328_3)"
        strokeWidth="1.2"
        transform="matrix(1.263158,0,0,1.263158,0,0)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1328_3"
          x1="10.5"
          y1="1"
          x2="10.5"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);

export const IconHome = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 21 19" fill="none">
      <Path
        d="M1 5.67372L10.2454 1.05991C10.3245 1.02051 10.4116 1 10.5 1C10.5884 1 10.6755 1.02051 10.7546 1.05991L20 5.67372M18.1 8.51825V16.1036C18.1 16.6066 17.8998 17.0889 17.5435 17.4446C17.1872 17.8002 16.7039 18 16.2 18H4.8C4.29609 18 3.81282 17.8002 3.4565 17.4446C3.10018 17.0889 2.9 16.6066 2.9 16.1036V8.51825"
        stroke="url(#paint0_linear_1328_3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1 5.67372L10.2454 1.05991C10.3245 1.02051 10.4116 1 10.5 1C10.5884 1 10.6755 1.02051 10.7546 1.05991L20 5.67372M18.1 8.51825V16.1036C18.1 16.6066 17.8998 17.0889 17.5435 17.4446C17.1872 17.8002 16.7039 18 16.2 18H4.8C4.29609 18 3.81282 17.8002 3.4565 17.4446C3.10018 17.0889 2.9 16.6066 2.9 16.1036V8.51825"
        stroke="url(#paint0_linear_1328_3)"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1328_3"
          x1="10.5"
          y1="1"
          x2="10.5"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);

export const IconGraph = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path
        d="M18 1.68856C18 2.38649 17.5728 2.99437 16.9656 3.24203V18H0L4.74453 10.424C4.59204 10.1646 4.5106 9.86949 4.50843 9.56848C4.50843 8.63415 5.26171 7.87992 6.19488 7.87992C7.12805 7.87992 7.88132 8.63415 7.88132 9.56848C7.88132 9.71482 7.85884 9.84991 7.82511 9.98499L9.4441 10.6942C9.74766 10.3565 10.1974 10.1313 10.6921 10.1313C10.8944 10.1313 11.0856 10.1764 11.2655 10.2326L15.2904 3.01689C14.8857 2.71295 14.6271 2.22889 14.6271 1.68856C14.6271 0.754221 15.3804 0 16.3136 0C16.5272 0 16.7183 0.045028 16.9094 0.11257L16.9656 0.011257V0.135084C17.5728 0.382739 18 0.990619 18 1.68856ZM15.8413 16.8743V4.33396L12.1424 10.9644C12.2886 11.2233 12.3785 11.5047 12.3785 11.8199C12.3785 12.7542 11.6252 13.5084 10.6921 13.5084C9.7589 13.5084 9.00562 12.7542 9.00562 11.8199L9.01686 11.7411L7.18426 10.9306C6.90319 11.1332 6.5659 11.257 6.19488 11.257C5.9925 11.257 5.80137 11.212 5.62149 11.1445L2.02374 16.8743H15.8413Z"
        fill="url(#paint0_linear_1354_39)"
      />
      <Path
        d="M18 1.68856C18 2.38649 17.5728 2.99437 16.9656 3.24203V18H0L4.74453 10.424C4.59204 10.1646 4.5106 9.86949 4.50843 9.56848C4.50843 8.63415 5.26171 7.87992 6.19488 7.87992C7.12805 7.87992 7.88132 8.63415 7.88132 9.56848C7.88132 9.71482 7.85884 9.84991 7.82511 9.98499L9.4441 10.6942C9.74766 10.3565 10.1974 10.1313 10.6921 10.1313C10.8944 10.1313 11.0856 10.1764 11.2655 10.2326L15.2904 3.01689C14.8857 2.71295 14.6271 2.22889 14.6271 1.68856C14.6271 0.754221 15.3804 0 16.3136 0C16.5272 0 16.7183 0.045028 16.9094 0.11257L16.9656 0.011257V0.135084C17.5728 0.382739 18 0.990619 18 1.68856ZM15.8413 16.8743V4.33396L12.1424 10.9644C12.2886 11.2233 12.3785 11.5047 12.3785 11.8199C12.3785 12.7542 11.6252 13.5084 10.6921 13.5084C9.7589 13.5084 9.00562 12.7542 9.00562 11.8199L9.01686 11.7411L7.18426 10.9306C6.90319 11.1332 6.5659 11.257 6.19488 11.257C5.9925 11.257 5.80137 11.212 5.62149 11.1445L2.02374 16.8743H15.8413Z"
        fill="black"
        fillOpacity="0.2"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1354_39"
          x1="9"
          y1="0"
          x2="9"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);

export const IconRegister = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 1V15M1 8H15"
        stroke="url(#paint0_linear_1354_43)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 1V15M1 8H15"
        stroke="black"
        strokeOpacity="0.2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1354_43"
          x1="8"
          y1="1"
          x2="8"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);

export const IconNewMeasure = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
      <Path
        d="M1.875 15C2.90625 15 3.75 14.1562 3.75 13.125V6.5625C3.75 5.53125 2.90625 4.6875 1.875 4.6875C0.84375 4.6875 0 5.53125 0 6.5625V13.125C0 14.1562 0.84375 15 1.875 15ZM11.25 10.3125V13.125C11.25 14.1562 12.0938 15 13.125 15C14.1562 15 15 14.1562 15 13.125V10.3125C15 9.28125 14.1562 8.4375 13.125 8.4375C12.0938 8.4375 11.25 9.28125 11.25 10.3125ZM7.5 15C8.53125 15 9.375 14.1562 9.375 13.125V1.875C9.375 0.84375 8.53125 0 7.5 0C6.46875 0 5.625 0.84375 5.625 1.875V13.125C5.625 14.1562 6.46875 15 7.5 15Z"
        fill="url(#paint0_linear_1354_47)"
      />
      <Path
        d="M1.875 15C2.90625 15 3.75 14.1562 3.75 13.125V6.5625C3.75 5.53125 2.90625 4.6875 1.875 4.6875C0.84375 4.6875 0 5.53125 0 6.5625V13.125C0 14.1562 0.84375 15 1.875 15ZM11.25 10.3125V13.125C11.25 14.1562 12.0938 15 13.125 15C14.1562 15 15 14.1562 15 13.125V10.3125C15 9.28125 14.1562 8.4375 13.125 8.4375C12.0938 8.4375 11.25 9.28125 11.25 10.3125ZM7.5 15C8.53125 15 9.375 14.1562 9.375 13.125V1.875C9.375 0.84375 8.53125 0 7.5 0C6.46875 0 5.625 0.84375 5.625 1.875V13.125C5.625 14.1562 6.46875 15 7.5 15Z"
        fill="black"
        fillOpacity="0.2"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1354_47"
          x1="7.5"
          y1="0"
          x2="7.5"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);

export const IconAccount2 = ({ size = 24 }: IconProps) => (
  <View>
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 16C8 16 16 16 16 14C16 11.6 12.1 9 8 9C3.9 9 0 11.6 0 14C0 16 8 16 8 16Z"
        fill="url(#paint0_linear_1354_51)"
      />
      <Path
        d="M8 0C9.06087 0 10.0783 0.421427 10.8284 1.17157C11.5786 1.92172 12 2.93913 12 4C12 5.06087 11.5786 6.07828 10.8284 6.82843C10.0783 7.57857 9.06087 8 8 8C6.93913 8 5.92172 7.57857 5.17157 6.82843C4.42143 6.07828 4 5.06087 4 4C4 2.93913 4.42143 1.92172 5.17157 1.17157C5.92172 0.421427 6.93913 0 8 0ZM8 16C8 16 16 16 16 14C16 11.6 12.1 9 8 9C3.9 9 0 11.6 0 14C0 16 8 16 8 16Z"
        fill="black"
        fillOpacity="0.2"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1354_51"
          x1="8"
          y1="0"
          x2="8"
          y2="16"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9957DF" />
          <Stop offset="1" stopColor="#B89EFF" />
        </LinearGradient>
      </Defs>
    </Svg>
  </View>
);
