# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import scapy
from scapy.all import *
from scapy.utils import PcapReader

import socket

FILE = "test.pcap"


def parserPacket():
    packets = rdpcap(FILE)
    relation = dict()
    for data in packets:
        seq = data["TCP"].seq
        ack = data["TCP"].ack
        if "GET" not in str(data.original):
            if seq in relation:
                relation[seq][-1] = data.time
            else:
                relation[seq] = relation[ack] = [0, 0, data.time]
        else:
            if ack in relation:
                relation[ack][0] = data.time
            else:
                relation[ack] = [data.time, 0, 0]
    print(relation)


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    parserPacket()
