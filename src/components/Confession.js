import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import './Confession.css';

const Container = styled.div`
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-x: hidden;
  overflow-y: visible;
  position: relative;
  background: radial-gradient(circle at 20% 20%, rgba(173, 113, 255, 0.6), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(74, 222, 255, 0.4), transparent 45%),
    radial-gradient(circle at 50% 80%, rgba(255, 136, 255, 0.35), transparent 50%),
    #040316;
  color: #f7f4ff;
  padding: 20px;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.55) 1px, transparent 1px),
      radial-gradient(rgba(141, 199, 255, 0.35) 1px, transparent 1px);
    background-size: 140px 140px, 90px 90px;
    background-position: 20px 40px, 60px 80px;
    opacity: 0.4;
    animation: starDrift 120s linear infinite;
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -15%;
    background:
      radial-gradient(circle at 15% 30%, rgba(120, 58, 255, 0.35), transparent 55%),
      radial-gradient(circle at 85% 10%, rgba(68, 227, 255, 0.25), transparent 40%),
      radial-gradient(circle at 60% 75%, rgba(255, 171, 255, 0.25), transparent 45%);
    filter: blur(0px);
    opacity: 0.55;
    animation: planetGlow 80s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }

  & > *:not(.decor-layer) {
    position: relative;
    z-index: 1;
  }

  & > .decor-layer {
    position: absolute;
    z-index: 0;
  }

  @keyframes starDrift {
    0% {
      background-position: 20px 40px, 60px 80px;
    }
    100% {
      background-position: 320px 440px, 360px 480px;
    }
  }

  @keyframes planetGlow {
    0% {
      transform: scale(1) translateY(0px);
    }
    100% {
      transform: scale(1.08) translateY(-20px);
    }
  }
`;

const Glitter = styled.span`
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(1px);
  animation: glitter 3s ease-in-out infinite;
  opacity: 0;
  ${Array(20).fill(0).map((_, i) => `
    &:nth-of-type(${i + 1}) {
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 5}s;
      animation-duration: ${Math.random() * 3 + 2}s;
    }
  `).join('')}
`;

const PlanetCluster = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  display: block;
  z-index: 0;
  overflow: hidden;

  span {
    position: absolute;
    font-size: 2.8rem;
    opacity: 0.8;
    filter: drop-shadow(0 0 15px rgba(164, 192, 255, 0.9));
    animation: floaty 20s ease-in-out infinite;
    will-change: transform;
  }

  span:nth-of-type(1) {
    top: 10%;
    left: 15%;
    animation: floaty 30s ease-in-out infinite, glow 4s ease-in-out infinite alternate;
  }

  span:nth-of-type(2) {
    top: 25%;
    right: 12%;
    animation: floaty 35s ease-in-out infinite reverse, glow 5s ease-in-out 1s infinite alternate;
  }

  span:nth-of-type(3) {
    bottom: 18%;
    left: 12%;
    animation: floaty 40s ease-in-out infinite, glow 6s ease-in-out 2s infinite alternate;
  }

  span:nth-of-type(4) {
    bottom: 8%;
    right: 20%;
    animation: floaty 25s ease-in-out infinite reverse, glow 4.5s ease-in-out 1.5s infinite alternate;
  }

  @keyframes floaty {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }
    25% {
      transform: translate(10px, -15px) rotate(5deg);
    }
    50% {
      transform: translate(20px, 0) rotate(0deg);
    }
    75% {
      transform: translate(10px, 15px) rotate(-5deg);
    }
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @keyframes glow {
    0% {
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
      opacity: 0.7;
    }
    100% {
      filter: drop-shadow(0 0 20px rgba(164, 192, 255, 0.9));
      opacity: 0.9;
    }
  }

  @keyframes glitter {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 30px;
  position: relative;
  min-height: 80px;
`;

const SecondaryButton = styled(motion.button)`
  margin-top: 25px;
  padding: 10px 22px;
  font-size: 1rem;
  border-radius: 40px;
  border: 1px solid rgba(150, 116, 255, 0.6);
  background: rgba(16, 8, 32, 0.65);
  color: #f6f2ff;
  cursor: pointer;
  backdrop-filter: blur(6px);
`;

const ProgressDots = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 35px;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ active }) => (active ? '#fff' : 'rgba(255, 255, 255, 0.4)')};
  box-shadow: ${({ active }) => (active ? '0 0 12px rgba(255, 255, 255, 0.8)' : 'none')};
  transition: background 0.3s ease, box-shadow 0.3s ease;
`;

const Heart = styled(motion.div)`
  font-size: 5rem;
  margin: 20px 0;
  cursor: pointer;
  color: #fdfbff;
  text-shadow: 0 0 25px rgba(163, 123, 255, 0.8);
`;

const Message = styled(motion.div)`
  font-size: 1.5rem;
  margin: 20px auto;
  max-width: 600px;
  line-height: 1.6;
  text-align: center;
  color: #f2ecff;
`;

const Intro = styled(motion.p)`
  max-width: 650px;
  margin: 0 auto 25px;
  font-size: 1.2rem;
  line-height: 1.8;
  opacity: 0.9;
  color: #cfc5ff;
`;

const Section = styled(motion.section)`
  width: 100%;
  max-width: 820px;
  background: rgba(15, 10, 39, 0.85);
  border-radius: 28px;
  padding: 40px;
  box-shadow: 0 25px 60px rgba(5, 2, 25, 0.85);
  border: 1px solid rgba(192, 156, 255, 0.3);
  backdrop-filter: blur(18px);
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 25px;
`;

const StoryCard = styled(motion.div)`
  padding: 20px;
  border-radius: 20px;
  background: rgba(37, 22, 84, 0.8);
  border: 1px solid rgba(162, 132, 255, 0.4);
  
  .subchapter {
    display: block;
    color: #ff9e7d;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 1.1em;
  }
  text-align: left;
  line-height: 1.6;
  color: #e9ddff;
`;

const Button = styled(motion.button)`
  margin: 10px;
  padding: 12px 30px;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #7a5af8, #c084fc);
  color: #0a041a;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(96, 64, 164, 0.45);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(168, 132, 255, 0.4);
  }
`;

function Confession() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfession, setShowConfession] = useState(false);
  const [response, setResponse] = useState(null);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setNoButtonPosition({ x: 0, y: 0 });
  }, [currentPage]);

  const resetStory = () => {
    setCurrentPage(1);
    setShowConfession(false);
    setResponse(null);
  };

  const openConfessionPage = () => {
    setCurrentPage(2);
    setShowConfession(false);
  };

  const handleYes = () => {
    setResponse('yes');
    setTimeout(() => setCurrentPage(3), 800);
  };

  // TELEPORT on click - instant random position
  const handleNo = () => {
    setNoButtonPosition({
      x: Math.random() * 260 - 130,
      y: Math.random() * 220 - 110,
    });
  };

  return (
    <Container className="fade-transition">
      <PlanetCluster className="decor-layer">
        <span>🪐</span>
        <span>✨</span>
        <span>🌙</span>
        <span>⭐</span>
        {Array(120).fill(0).map((_, i) => (
          <Glitter key={i} />
        ))}
      </PlanetCluster>

      {currentPage === 1 && (
        <Section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Disini aku pake bahasa Indo + Inggris campur yh, wakaka jadi jaksel gini brok
          </motion.h1>
          <Intro
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Aku mau klarifikasi dulu, tolong jangan ngerasa cringe/aneh dulu ya HEHEHE, aku gugup sejujurnya bikin ini.
            Dari dulu sampai sekarang, aku masih berpikir. Ini mimpi kah? karena aku gapernah mengira kalau aku bisa ngerasa sedakat ini sama kamu, saff.
          </Intro>
          <StoryGrid>
            {[
              {
                title: 'Chapter 1',
                text: 'Our First Met. Hmm, dulu aku gatau beneran kamu siapa sampe ada yang bilang "weh, itu anak bahasa terkenal banget" aku penasaran dan aku cari tau, ternyata nama dia Saffanah! Kebetulan aku punya temen dari MTS yaitu Ana dan Ameera, aku sempat beberapa kali tanya ke mereka soal kamu. Dan yaa... dari cerita mereka aja aku udah cukup sadar diri (waktu itu) WAJWAKWAKAK.'
              },
              {
                title: 'Chapter 2',
                text: 'Reunited. Setelah beberapa waktu aku tidak melihat dirimu, aku kembali melihatmu saat ospek. AKU KIRA, kamunya salah fakultas WKWKAWKWKA, soalnya.. aku dapet info kamu masuknya di Sastra Inggris waktu itu. Makanya aku kaget, banget sih. Aku sampe nanya langsung ke temen sasing ku, eh ternyata kamu beneran di PBI sksksk.'
              },
              {
                title: 'Chapter 3',
                text: 'Undescribable Feeling. Semasa PKMB 2024, aku melihat kamu lagi, dan dari dekat. Waktu melihat kamu, ntah kenapa sesuatu yang aku bawa dari masa MAJESA masih terbawa. Waktu itu juga aku mau mengenal kamu lebih dekat, tapi aku malu banget wkwk.. aku bingung gimana caranya. Sampai ke ESACOMP 12, aku masih mencoba mengenal kamu. Dan dari situ, aku mulai merasa lebih mengenal kamu dari sebelumnya.'
              },

            ].map(({ title, text }, idx) => (
              <StoryCard
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
              >
                <strong>{title}</strong>
                <p>{text}</p>
              </StoryCard>
            ))}
          </StoryGrid>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            style={{ marginTop: '35px' }}
            onClick={openConfessionPage}
          >
            Lanjut bang ➜
          </Button>
        </Section>
      )}

      {currentPage === 2 && (
        <Section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Wow, kita udah sampai di intinya ya? Semoga setelah ini kita masih bisa mengenal baik atau bahkan lebih baikkk hehe.
          </motion.h1>
          <Intro
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Saffaaa, aku merasa sudah cukup dekat dan aku ingin mengenal kamu lebih jauh. Aku.. tidak ingin menjadi seorang "pacar" bagimu, tetapi seorang pasangan. Seseorang yang selalu menjadi Your Number 1 Fan in every situation, the one who always supports you after your family, and the one who always try his best to keep you safe.
            And.. Saff. Insya Allah, if you give me the opportunity to be with you, Aku akan benar-benar memanfaatkan kesempatan ini sebaik mungkin agar bisa bersama sampai ke jenjang selanjutnya. I mean this, so much.
          </Intro>

          <Heart
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => setShowConfession(!showConfession)}
          >
            🌟
          </Heart>

          {showConfession && (
            <Message
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <center>Semua yang aku state di atas dan page sebelumnya sudah cukup mewakilkan, kalau kamu ingin bertanya bisa lanjut whatsapp yah ehehe. Jadi.. <br /><br />
              <strong>Would you?</strong></center>
            </Message>
          )}

          <ButtonRow>
            <Button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleYes}
            >
              Yes!
            </Button>
            <Button
              className="no-button"
              onClick={handleNo}
              animate={{ x: noButtonPosition.x, y: noButtonPosition.y }}
              transition={{ duration: 0, type: 'tween' }}
              style={{ background: 'linear-gradient(135deg, #ff9e9e, #ff6b6b)' }}
            >
              No
            </Button>
          </ButtonRow>

          <SecondaryButton
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={resetStory}
          >
            ← Balik lagi ke halaman sebelumnya brader
          </SecondaryButton>
        </Section>
      )}

      {currentPage === 3 && response === 'yes' && (
        <Section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            TERIMA KASIH! maafkan aku kalau ada sesuatu yang tidak enak ya.
          </motion.h1>
          <Message
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: '#ffeb3b', fontSize: '1.8rem' }}
          >
            Apapun jawaban yang kamu berikan, aku seneng banget kokkk! sehat selalu ya kamu, and i'll always be there to support you, and keep you safe.
          </Message>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={resetStory}
          >
            Mo balik lagi bang ↺
          </Button>
        </Section>
      )}

      <ProgressDots>
        {[1, 2, 3].map((page) => (
          <Dot key={page} active={currentPage === page} />
        ))}
      </ProgressDots>

      <motion.div
        style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
      >
        Made with /sedikit bumbu/ loveeee by gany ganteng hahay
      </motion.div>
    </Container>
  );
}

export default Confession;
