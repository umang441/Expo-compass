import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Line, Text as SvgText, G, Polygon, Defs, RadialGradient, Stop } from 'react-native-svg';

interface CompassDialProps {
  heading: number; // Continuous angle in degrees
  size?: number;
}

const { width } = Dimensions.get('window');
const DEFAULT_SIZE = Math.min(width * 0.85, 340);

export const CompassDial: React.FC<CompassDialProps> = ({ heading, size = DEFAULT_SIZE }) => {
  const center = size / 2;
  const radius = center - 16;

  // Reanimated style to smoothly rotate dial in opposite direction of heading
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: withSpring(`${-heading}deg`, {
            damping: 24,
            stiffness: 120,
            mass: 0.8,
          }),
        },
      ],
    };
  });

  // Render ticks every 5 degrees, major labels every 30 degrees
  const renderTicksAndLabels = () => {
    const elements = [];
    for (let deg = 0; deg < 360; deg += 5) {
      const isMajor = deg % 30 === 0;
      const isCardinal = deg % 90 === 0;
      const tickLength = isCardinal ? 14 : isMajor ? 10 : 5;
      const tickWidth = isCardinal ? 2.5 : isMajor ? 1.8 : 1;
      const tickColor = isCardinal ? '#E2E8F0' : isMajor ? '#94A3B8' : '#475569';

      const angleRad = (deg - 90) * (Math.PI / 180);
      const outerX = center + radius * Math.cos(angleRad);
      const outerY = center + radius * Math.sin(angleRad);
      const innerX = center + (radius - tickLength) * Math.cos(angleRad);
      const innerY = center + (radius - tickLength) * Math.sin(angleRad);

      elements.push(
        <Line
          key={`tick-${deg}`}
          x1={outerX}
          y1={outerY}
          x2={innerX}
          y2={innerY}
          stroke={tickColor}
          strokeWidth={tickWidth}
          strokeLinecap="round"
        />
      );

      // Render degree label for major ticks
      if (isMajor && !isCardinal) {
        const labelRadius = radius - 26;
        const lx = center + labelRadius * Math.cos(angleRad);
        const ly = center + labelRadius * Math.sin(angleRad);
        elements.push(
          <SvgText
            key={`label-${deg}`}
            x={lx}
            y={ly + 4}
            fill="#64748B"
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            {deg}
          </SvgText>
        );
      }
    }
    return elements;
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Static Top Pointer/Indicator Arrow */}
      <View style={styles.topPointerContainer}>
        <View style={styles.topPointer} />
      </View>

      {/* Rotating Dial Container */}
      <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <RadialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <Stop offset="80%" stopColor="#0F172A" stopOpacity="0.95" />
              <Stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Outer Ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="url(#dialGrad)"
            stroke="#334155"
            strokeWidth="2.5"
          />

          {/* Inner Accent Ring */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 40}
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.5"
            strokeDasharray="4, 4"
          />

          {/* Ticks and degree numbers */}
          {renderTicksAndLabels()}

          {/* Cardinal Directions */}
          {/* NORTH (Red accent) */}
          <SvgText
            x={center}
            y={center - radius + 34}
            fill="#EF4444"
            fontSize="22"
            fontWeight="bold"
            textAnchor="middle"
          >
            N
          </SvgText>

          {/* EAST */}
          <SvgText
            x={center + radius - 30}
            y={center + 7}
            fill="#F8FAFC"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
          >
            E
          </SvgText>

          {/* SOUTH */}
          <SvgText
            x={center}
            y={center + radius - 20}
            fill="#F8FAFC"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
          >
            S
          </SvgText>

          {/* WEST */}
          <SvgText
            x={center - radius + 30}
            y={center + 7}
            fill="#F8FAFC"
            fontSize="18"
            fontWeight="bold"
            textAnchor="middle"
          >
            W
          </SvgText>

          {/* North Star Diamond Pointer */}
          <Polygon
            points={`${center},${center - radius + 6} ${center - 6},${center - radius + 16} ${center + 6},${center - radius + 16}`}
            fill="#EF4444"
          />
        </Svg>
      </Animated.View>

      {/* Center Fixed Cap */}
      <View style={[styles.centerCap, { top: center - 12, left: center - 12 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  topPointerContainer: {
    position: 'absolute',
    top: -12,
    zIndex: 10,
    alignItems: 'center',
  },
  topPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#38BDF8', // Cyan heading marker
  },
  centerCap: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    borderWidth: 3,
    borderColor: '#0F172A',
    zIndex: 5,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 8,
  },
});
